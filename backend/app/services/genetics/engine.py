from math import exp, prod
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel


class PredictionInput(BaseModel):
    mode: str  # "individual" | "parents"
    father_sequence: Optional[str] = None
    mother_sequence: Optional[str] = None
    sequence: Optional[str] = None


REFERENCE_GENES: Dict[str, str] = {
    "HBB": "ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCT",
    "CFTR": "ATGGAATTTCGCGATGGTGTTTCCTATGATGAATATAGATACAGA",
    "AZFA_sY84": "ATGCCTGGTGAGAAATGTTTGGCTTTGTTGGA",
    "AZFA_sY86": "GTTTCCTGGATCGATGTGGCTCAGTTCCAGAA",
    "AZFB_sY127": "CCACTGACTTTGGTGACCTGGATGCTGTACCT",
    "AZFB_sY134": "ACTGCCTGACTTTGGGGACTGTTCCTGTGGAA",
    "AZFC_sY254": "TGGGCCATTTGACATCTCCAGGTTCTGCTTGA",
    "AZFC_sY255": "CGATGCTGATGGCCTTAGTTGGTGACTGTTGA",
    "F8": "ATGAGAGAGGAAATGTTGGTCCTGCTATCAGTGGATGCCTCCGTA",
    "ABO": "ATGGCCGCCGCTGCTGCTGCTGGCCCTGCTGCTGCTGGCGCT",
    "RHD": "ATGGTGCTGCTGATCCTGCTGCTGCTGGCTCTGGTGCTGCTG",
}

PATHOGENIC_MARKERS = {
    "HBB_SICKLE_MUT": "GTG",
    "HBB_SICKLE_WT": "GAG",
    "ABO_261DEL_G": "GCCGCCGCTGCTGCTGCTGCCCTG",
    "ABO_B_ARG176GLY": "CCTGCTGCTGGCGCTGACTGGGAA",
    "ABO_B_GLY235SER": "GGCGCTGACTGGGAAGGTGCCATG",
}


def _sanitize_fasta(raw: str) -> str:
    lines = [line.strip() for line in raw.strip().splitlines() if line.strip()]
    if not lines or not lines[0].startswith(">"):
        raise ValueError("Sequence must start with FASTA header '>'")
    seq = "".join(lines[1:]).upper()
    if not seq or any(ch not in {"A", "T", "C", "G", "N"} for ch in seq):
        raise ValueError("Sequence payload must only include A/T/C/G/N")
    n_ratio = seq.count("N") / len(seq)
    if n_ratio > 0.10:
        raise ValueError("Ambiguous bases (N) exceed 10%")
    return seq


def _smith_waterman_identity(subject: str, ref: str, match: float = 2.0, mismatch: float = -1.0, gap_open: float = -2.0, gap_extend: float = -0.5) -> Tuple[float, int]:
    m, n = len(subject), len(ref)
    h = [[0.0] * (n + 1) for _ in range(m + 1)]
    e = [[0.0] * (n + 1) for _ in range(m + 1)]
    f = [[0.0] * (n + 1) for _ in range(m + 1)]
    best = 0.0

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            e[i][j] = max(h[i - 1][j] + gap_open, e[i - 1][j] + gap_extend)
            f[i][j] = max(h[i][j - 1] + gap_open, f[i][j - 1] + gap_extend)
            diag = h[i - 1][j - 1] + (match if subject[i - 1] == ref[j - 1] else mismatch)
            h[i][j] = max(0.0, diag, e[i][j], f[i][j])
            best = max(best, h[i][j])

    identity = (best / (2.0 * max(1, len(ref)))) * 100.0
    return min(100.0, max(0.0, identity)), int(round(best))


def calculate_homology(sequence: str, reference: str, k: int = 4) -> float:
    if not sequence or not reference:
        return 0.0
    sw_identity, _ = _smith_waterman_identity(sequence, reference)
    if len(reference) < k or len(sequence) < k:
        return max(0.0, min(1.0, sw_identity / 100.0))

    ref_kmers = {reference[i : i + k] for i in range(len(reference) - k + 1)}
    seq_kmers = {sequence[i : i + k] for i in range(len(sequence) - k + 1)}
    kmer_overlap = len(ref_kmers & seq_kmers) / max(1, len(ref_kmers))
    combined = (sw_identity / 100.0) * 0.6 + kmer_overlap * 0.4
    return max(0.0, min(1.0, combined))


def sigmoid_probability(homology: float, lambda_value: float, threshold: float) -> float:
    return 1.0 / (1.0 + exp(lambda_value * (homology - threshold)))


def _infer_genotype(identity: float, pathogenic_count: int) -> Tuple[str, float]:
    if identity >= 95.0 and pathogenic_count == 0:
        return "N/N", 0.0
    if identity < 75.0 and pathogenic_count >= 2:
        return "M/M", 1.0
    return "N/M", 0.5


def _autosomal_parents_probs(pm_f: float, pm_m: float) -> Dict[str, float]:
    pn_f = 1.0 - pm_f
    pn_m = 1.0 - pm_m
    return {"affected": pm_f * pm_m, "carrier": (pm_f * pn_m) + (pn_f * pm_m), "healthy": pn_f * pn_m}


def _detect_abo_allele(seq: str) -> str:
    if PATHOGENIC_MARKERS["ABO_261DEL_G"] in seq:
        return "O"
    if PATHOGENIC_MARKERS["ABO_B_ARG176GLY"] in seq or PATHOGENIC_MARKERS["ABO_B_GLY235SER"] in seq:
        return "B"
    return "A"


def _detect_rhd(seq: str) -> str:
    identity, _ = _smith_waterman_identity(seq, REFERENCE_GENES["RHD"])
    return "+" if identity >= 75.0 else "-"


def _blood_distribution(alleles_f: str, alleles_m: str, rh_f: str, rh_m: str) -> Dict[str, float]:
    abo_pairs = [(a, b) for a in alleles_f for b in alleles_m]
    rh_pairs = [(a, b) for a in rh_f for b in rh_m]
    out = {k: 0.0 for k in ["A_positive", "A_negative", "B_positive", "B_negative", "AB_positive", "AB_negative", "O_positive", "O_negative"]}
    for a1, a2 in abo_pairs:
        if "A" in (a1, a2) and "B" in (a1, a2):
            abo = "AB"
        elif "A" in (a1, a2):
            abo = "A"
        elif "B" in (a1, a2):
            abo = "B"
        else:
            abo = "O"
        for r1, r2 in rh_pairs:
            rh = "positive" if "+" in (r1, r2) else "negative"
            key = f"{abo}_{rh}"
            out[key] += 100.0 / (len(abo_pairs) * len(rh_pairs))
    return {k: round(v, 2) for k, v in out.items()}


def _severity_from_homology(h: float, is_y: bool = False) -> str:
    if is_y and h < 0.85:
        return "Severe Infertility"
    if h >= 0.95:
        return "Asymptomatic / Mild"
    if 0.85 <= h < 0.95:
        return "Moderate"
    return "Severe / Pathogenic"


def _severity_from_probabilities(affected: float, carrier: float, is_y: bool = False) -> str:
    if is_y and affected > 0:
        return "Severe Infertility"
    if affected > 0:
        return "Severe"
    if carrier > 0:
        return "Asymptomatic / Mild"
    return "Asymptomatic / Mild"


def _immunity_classification(score: int) -> str:
    if score >= 90:
        return "Excellent"
    if score >= 70:
        return "Good"
    if score >= 50:
        return "Moderate"
    if score >= 30:
        return "Low"
    return "Very Low"


def run_prediction(input_data: PredictionInput) -> Dict[str, Any]:
    mode = "parents" if input_data.mode in {"dual", "parents"} else "individual"

    if mode == "individual":
        if not input_data.sequence:
            raise ValueError("Individual mode requires sequence")
        seq_f = _sanitize_fasta(input_data.sequence)
        seq_m = None
    else:
        if not input_data.father_sequence or not input_data.mother_sequence:
            raise ValueError("Parents mode requires father_sequence and mother_sequence")
        seq_f = _sanitize_fasta(input_data.father_sequence)
        seq_m = _sanitize_fasta(input_data.mother_sequence)

    model_params = {
        "Beta-Thalassemia": {"gene": "HBB", "T": 0.96, "lambda": 150.0},
        "Cystic Fibrosis": {"gene": "CFTR", "T": 0.94, "lambda": 120.0},
        "Sickle Cell Disease": {"gene": "HBB", "T": 0.98, "lambda": 200.0},
        "Y-Chromosome Infertility": {"gene": "AZF", "T": 0.85, "lambda": 80.0},
    }
    genes = ["Beta-Thalassemia", "Cystic Fibrosis", "Sickle Cell Disease"]
    diseases: List[Dict[str, Any]] = []
    affected_probs_for_joint: Dict[str, float] = {}
    mutation_detection_details: List[str] = []
    disease_severity_prediction: List[Dict[str, str]] = []
    homology_scores: Dict[str, Dict[str, float]] = {}

    for disease_name in genes:
        gene = model_params[disease_name]["gene"]
        h_f = calculate_homology(seq_f, REFERENCE_GENES[gene])
        if h_f < 0.5:
            h_f = 1.0
            pm_f = 0.0
        else:
            pm_f = sigmoid_probability(h_f, model_params[disease_name]["lambda"], model_params[disease_name]["T"])
        gf = "M/M" if pm_f >= 0.75 else "N/M" if pm_f >= 0.25 else "N/N"

        if mode == "parents" and seq_m is not None:
            h_m = calculate_homology(seq_m, REFERENCE_GENES[gene])
            if h_m < 0.5:
                h_m = 1.0
                pm_m = 0.0
            else:
                pm_m = sigmoid_probability(h_m, model_params[disease_name]["lambda"], model_params[disease_name]["T"])
            gm = "M/M" if pm_m >= 0.75 else "N/M" if pm_m >= 0.25 else "N/N"
            probs = _autosomal_parents_probs(pm_f, pm_m)
        else:
            # Individual mode: Predict the individual's own risk profile assuming the sequence reflects their allele frequency
            h_m, gm, pm_m = 1.0, "N/N", 0.0
            probs = {
                "affected": pm_f ** 2,
                "carrier": 2 * pm_f * (1.0 - pm_f),
                "healthy": (1.0 - pm_f) ** 2
            }

        severity_label = _severity_from_homology(min(h_f, h_m))
        affected_probs_for_joint[disease_name] = probs["affected"]
        homology_scores[disease_name] = {"father": round(h_f, 4), "mother": round(h_m, 4)}
        disease_severity_prediction.append({"disease": disease_name, "severity": severity_label})

        mutations: List[str] = []
        if disease_name == "Sickle Cell Disease" and PATHOGENIC_MARKERS["HBB_SICKLE_MUT"] in seq_f and PATHOGENIC_MARKERS["HBB_SICKLE_WT"] in REFERENCE_GENES["HBB"]:
            msg = "Mutation Detected: HBB Glu6Val (rs334) - Sickle Cell Trait"
            mutations.append(msg)
            mutation_detection_details.append(msg)

        diseases.append(
            {
                "name": disease_name,
                "inheritance_type": "Autosomal Recessive",
                "general_probabilities": {k: round(v * 100.0, 1) for k, v in probs.items()},
                "sex_split": {
                    "male_child": {"affected": round(probs["affected"] * 100.0, 1), "carrier": round(probs["carrier"] * 100.0, 1), "healthy": round(probs["healthy"] * 100.0, 1)},
                    "female_child": {"affected": round(probs["affected"] * 100.0, 1), "carrier": round(probs["carrier"] * 100.0, 1), "healthy": round(probs["healthy"] * 100.0, 1)},
                },
                "severity": {"score": round((1.0 - min(h_f, h_m)) * 100.0, 1), "classification": severity_label},
                "mutations_detected": mutations,
                "genotype_inference": {"father": gf, "mother": gm},
                "carrier_risk_score": round(probs["carrier"] * 100.0, 1),
                "carrier_warning": f"Child has a {round(probs['carrier'] * 100.0, 1)}% continuous probability of carrying {disease_name} silently."
                if probs["carrier"] > probs["affected"] and probs["carrier"] > 0.15
                else "",
            }
        )

    # Y-linked AZF model
    azf_scores = {}
    is_azf_supplied = False
    for marker in ["AZFA_sY84", "AZFA_sY86", "AZFB_sY127", "AZFB_sY134", "AZFC_sY254", "AZFC_sY255"]:
        identity, _ = _smith_waterman_identity(seq_f, REFERENCE_GENES[marker])
        if identity > 40.0:
            is_azf_supplied = True
        azf_scores[marker] = 1.0 - (identity / 100.0)
    
    if not is_azf_supplied:
        azfa = azfb = azfc = 0.0
        h_azf = 1.0
        y_prob = 0.0
    else:
        azfa = max(azf_scores["AZFA_sY84"], azf_scores["AZFA_sY86"])
        azfb = max(azf_scores["AZFB_sY127"], azf_scores["AZFB_sY134"])
        azfc = max(azf_scores["AZFC_sY254"], azf_scores["AZFC_sY255"])
        h_azf = max(0.0, min(1.0, 1.0 - max(azfa, azfb, azfc)))
        y_prob = sigmoid_probability(h_azf, model_params["Y-Chromosome Infertility"]["lambda"], model_params["Y-Chromosome Infertility"]["T"])

    affected_probs_for_joint["Y-Chromosome Infertility"] = y_prob
    homology_scores["Y-Chromosome Infertility"] = {"father": round(h_azf, 4), "mother": 1.0}
    y_severity = _severity_from_homology(h_azf, is_y=True)
    disease_severity_prediction.append({"disease": "Y-Chromosome Infertility", "severity": y_severity})

    diseases.append(
        {
            "name": "Y-Chromosome Infertility",
            "inheritance_type": "Y-Linked",
            "general_probabilities": None,
            "sex_split": {
                "male_child": {"affected": round(y_prob * 100.0, 1), "carrier": 0.0, "healthy": round((1.0 - y_prob) * 100.0, 1)},
                "female_child": {"affected": 0.0, "carrier": 0.0, "healthy": 100.0},
            },
            "severity": {"score": round((1.0 - h_azf) * 100.0, 1), "classification": y_severity},
            "mutations_detected": [f"AZFa deletion score {azfa:.2f}", f"AZFb deletion score {azfb:.2f}", f"AZFc deletion score {azfc:.2f}"],
            "carrier_risk_score": 0.0,
            "carrier_warning": "",
        }
    )

    # Blood group model
    abo_f = _detect_abo_allele(seq_f)
    rh_f = _detect_rhd(seq_f)
    if mode == "parents" and seq_m is not None:
        abo_m = _detect_abo_allele(seq_m)
        rh_m = _detect_rhd(seq_m)
        blood_dist = _blood_distribution(abo_f + "O", abo_m + "O", rh_f + "-", rh_m + "-")
    else:
        abo_m = abo_f
        rh_m = rh_f
        # Individual mode: exact blood group based on phenotype
        bg_pheno = "AB" if "A" in abo_f and "B" in abo_f else abo_f
        rh_pheno = "positive" if rh_f == "+" else "negative"
        blood_dist = {f"{bg_pheno}_{rh_pheno}": 100.0}
        for key in ["A_positive", "A_negative", "B_positive", "B_negative", "AB_positive", "AB_negative", "O_positive", "O_negative"]:
            if key not in blood_dist:
                blood_dist[key] = 0.0

    if all(v == 0 for v in blood_dist.values()):
        blood_dist = {
            "O_positive": 33.0,
            "A_positive": 27.0,
            "B_positive": 31.0,
            "AB_positive": 9.0,
        }
    blood_dist_non_zero = {k: v for k, v in blood_dist.items() if v > 0}

    # Immunity score model (JSP with carrier penalty)
    thal_aff = affected_probs_for_joint.get("Beta-Thalassemia", 0.0)
    cf_aff = affected_probs_for_joint.get("Cystic Fibrosis", 0.0)
    sickle_aff = affected_probs_for_joint.get("Sickle Cell Disease", 0.0)
    jsp = (1.0 - thal_aff) * (1.0 - cf_aff) * (1.0 - sickle_aff)
    base_immunity = jsp * 100.0
    carrier_avg = (
        sum(
            (d["general_probabilities"]["carrier"] / 100.0)
            for d in diseases
            if d["inheritance_type"] == "Autosomal Recessive" and d["general_probabilities"] is not None
        )
        / 3.0
    )
    modifier = carrier_avg * 10.0
    immunity = max(0, min(100, round(base_immunity - modifier)))

    carrier_status_prediction = [
        {
            "disease": d["name"],
            "carrier_probability": round(d["general_probabilities"]["carrier"], 1) if d["general_probabilities"] else 0.0,
            "warning": d.get("carrier_warning", ""),
        }
        for d in diseases
        if d["inheritance_type"] == "Autosomal Recessive"
    ]

    sex_linked_split = {
        "Male": {
            "Y-Infertility": round(affected_probs_for_joint["Y-Chromosome Infertility"] * 100.0, 1),
            "CF": round(cf_aff * 100.0, 1),
        },
        "Female": {
            "Y-Infertility": 0.0,
            "CF": round(cf_aff * 100.0, 1),
        },
    }

    return {
        "mode": mode,
        # 1. Monogenic Disease Risk Scoring
        "monogenic_disease_risk_scoring": diseases,
        # 2. Immunity Points
        "immunity_score": {"value": immunity, "classification": _immunity_classification(immunity)},
        # 3. Carrier Status Prediction Summary
        "carrier_status_prediction": carrier_status_prediction,
        # 4. Predicted Blood Group (>0 only)
        "blood_group_probabilities": blood_dist_non_zero,
        # 5. Mutation Detection Details
        "mutation_detection_details": mutation_detection_details,
        # 6. Disease Severity Prediction
        "disease_severity_prediction": disease_severity_prediction,
        # 7. Sex-Linked Split Predictions
        "sex_linked_split": sex_linked_split,
        "sex_linked_split_predictions": sex_linked_split,
        "homology_scores": homology_scores,
        # Backward compatibility for existing components
        "diseases": diseases,
    }
