from typing import List, Dict, Optional, Any
from pydantic import BaseModel

class ParentData(BaseModel):
    genotypes: Dict[str, str]
    blood: str
    rh: str

class PredictionInput(BaseModel):
    mode: str  # "dual" | "single"
    parent1: ParentData
    parent2: Optional[ParentData] = None

def autosomal_punnett(g1: str, g2: str) -> List[Dict[str, Any]]:
    a1 = [g1[0], g1[1]]
    a2 = [g2[0], g2[1]]
    combos = {}
    for x in a1:
        for y in a2:
            sorted_genotype = "".join(sorted([x, y]))
            combos[sorted_genotype] = combos.get(sorted_genotype, 0) + 0.25
    
    results = []
    for genotype, prob in combos.items():
        upper = genotype.upper()
        lower = genotype.lower()
        status = "healthy"
        if genotype == lower:
            status = "affected"
        elif genotype != upper:
            status = "carrier"
        results.append({"genotype": genotype, "probability": prob, "status": status})
    return results

def sickle_cell_punnett(g1: str, g2: str) -> List[Dict[str, Any]]:
    a1 = [g1[0], g1[1]]
    a2 = [g2[0], g2[1]]
    combos = {}
    for x in a1:
        for y in a2:
            sorted_genotype = "".join(sorted([x, y]))
            combos[sorted_genotype] = combos.get(sorted_genotype, 0) + 0.25
    
    results = []
    for genotype, prob in combos.items():
        status = "healthy"
        if genotype == "SS":
            status = "affected"
        elif genotype == "AS":
            status = "carrier"
        results.append({"genotype": genotype, "probability": prob, "status": status})
    return results

def g6pd_prediction(g1: str, g2: str) -> Dict[str, Any]:
    is_male1 = "Y" in g1
    is_female2 = "Y" not in g2

    mother_x_alleles = []
    father_x_allele = ""

    if is_male1 and is_female2:
        father_x_allele = "Xg" if "Xg" in g1 else "XG"
        if g2 == "XGXg": mother_x_alleles = ["XG", "Xg"]
        elif g2 == "XgXg": mother_x_alleles = ["Xg", "Xg"]
        else: mother_x_alleles = ["XG", "XG"]
    elif not is_male1 and not is_female2:
        father_x_allele = "Xg" if "Xg" in g2 else "XG"
        if g1 == "XGXg": mother_x_alleles = ["XG", "Xg"]
        elif g1 == "XgXg": mother_x_alleles = ["Xg", "Xg"]
        else: mother_x_alleles = ["XG", "XG"]
    else:
        mother_x_alleles = ["XG", "Xg"]
        father_x_allele = "XG"

    male_results = {}
    female_results = {}

    for mx in mother_x_alleles:
        # Sons
        son_genotype = f"{mx}Y"
        son_status = "affected" if mx == "Xg" else "healthy"
        male_results[son_genotype] = male_results.get(son_genotype, {"count": 0, "status": son_status})
        male_results[son_genotype]["count"] += 1

        # Daughters
        daughter_genotype = "".join(sorted([mx, father_x_allele]))
        daughter_status = "healthy"
        if mx == "Xg" and father_x_allele == "Xg":
            daughter_status = "affected"
        elif mx == "Xg" or father_x_allele == "Xg":
            daughter_status = "carrier"
        
        female_results[daughter_genotype] = female_results.get(daughter_genotype, {"count": 0, "status": daughter_status})
        female_results[daughter_genotype]["count"] += 1

    total = len(mother_x_alleles)
    male_child = [{"status": v["status"], "probability": v["count"] / total} for v in male_results.values()]
    female_child = [{"status": v["status"], "probability": v["count"] / total} for v in female_results.values()]

    punnett = []
    for g, v in male_results.items():
        punnett.append({"genotype": g, "probability": (v["count"] / total) * 0.5, "status": v["status"]})
    for g, v in female_results.items():
        punnett.append({"genotype": g, "probability": (v["count"] / total) * 0.5, "status": v["status"]})

    return {"punnett": punnett, "sexLinked": {"maleChild": male_child, "femaleChild": female_child}}

def predict_blood_group(b1: str, b2: str, rh1: str, rh2: str) -> Dict[str, Any]:
    abo_alleles = {
        "IAIA": ["IA", "IA"], "IAi": ["IA", "i"], "IBIB": ["IB", "IB"], "IBi": ["IB", "i"],
        "IAIB": ["IA", "IB"], "ii": ["i", "i"],
    }
    a1 = abo_alleles.get(b1, ["i", "i"])
    a2 = abo_alleles.get(b2, ["i", "i"])
    abo_combos = {}
    for x in a1:
        for y in a2:
            sorted_g = "".join(sorted([x, y]))
            abo_combos[sorted_g] = abo_combos.get(sorted_g, 0) + 0.25
    
    genotype_to_group = {
        "IAIA": "A", "IAi": "A", "iIA": "A", "IBIB": "B", "IBi": "B", "iIB": "B",
        "IAIB": "AB", "IBIA": "AB", "ii": "O",
    }
    group_probs = {}
    for g, p in abo_combos.items():
        group = genotype_to_group.get(g, "O")
        group_probs[group] = group_probs.get(group, 0) + p
    
    possible_groups = [{"group": group, "probability": prob} for group, prob in group_probs.items()]

    r1 = [rh1[0], rh1[1]]
    r2 = [rh2[0], rh2[1]]
    rh_combos = {}
    for x in r1:
        for y in r2:
            sorted_rh = "".join(sorted([x, y]))
            rh_combos[sorted_rh] = rh_combos.get(sorted_rh, 0) + 0.25
    
    rh_probs = {}
    for g, p in rh_combos.items():
        type_ = "Rh−" if g == "dd" else "Rh+"
        rh_probs[type_] = rh_probs.get(type_, 0) + p
    
    possible_rh = [{"type": t, "probability": p} for t, p in rh_probs.items()]

    combined = []
    for g in possible_groups:
        for r in possible_rh:
            combined.append({
                "type": f"{g['group']}{'+' if r['type'] == 'Rh+' else '−'}",
                "probability": g["probability"] * r["probability"]
            })
    
    return {"possibleGroups": possible_groups, "possibleRh": possible_rh, "combined": [c for c in combined if c["probability"] > 0]}

def calculate_immunity_score(diseases: List[Dict[str, Any]]) -> int:
    if not diseases: return 85
    weights = {"severe": 0.4, "moderate": 0.25, "mild": 0.15, "none": 0.05}
    joint_risk = 0
    for d in diseases:
        w = weights.get(d["severity"], 0.1)
        joint_risk += d["affectedProb"] * w
    
    avg_risk = joint_risk / len(diseases)
    score = round(max(0, min(100, (1 - avg_risk * 3) * 100)))
    return score

def run_prediction(input_data: PredictionInput) -> Dict[str, Any]:
    parent1 = input_data.parent1
    parent2 = input_data.parent2
    is_dual = input_data.mode == "dual" and parent2 is not None

    disease_results = []
    sex_linked_result = {"maleChild": [], "femaleChild": []}

    # Beta Thalassemia
    bt_g1 = parent1.genotypes.get("beta_thalassemia", "AA")
    bt_g2 = parent2.genotypes.get("beta_thalassemia", "AA") if is_dual else "AA"
    bt_punnett = autosomal_punnett(bt_g1, bt_g2)
    bt_affected = sum(p["probability"] for p in bt_punnett if p["status"] == "affected")
    bt_carrier = sum(p["probability"] for p in bt_punnett if p["status"] == "carrier")
    disease_results.append({
        "disease": "Beta Thalassemia", "gene": "HBB", "chromosome": "11", "inheritance": "Autosomal Recessive",
        "color": "#10b981", "parent1Genotype": bt_g1, "parent2Genotype": bt_g2, "punnettSquare": bt_punnett,
        "affectedProb": bt_affected, "carrierProb": bt_carrier, "healthyProb": 1 - bt_affected - bt_carrier,
        "severity": "severe" if bt_affected > 0.2 else "moderate" if bt_carrier > 0.4 else "mild" if bt_carrier > 0 else "none",
        "mutationDetected": "a" in bt_g1 or "a" in bt_g2,
        "mutationDetails": "HBB gene mutation detected: β-globin chain variant" if ("a" in bt_g1 or "a" in bt_g2) else "No mutation detected",
    })

    # Sickle Cell
    sc_g1 = parent1.genotypes.get("sickle_cell", "AA")
    sc_g2 = parent2.genotypes.get("sickle_cell", "AA") if is_dual else "AA"
    sc_punnett = sickle_cell_punnett(sc_g1, sc_g2)
    sc_affected = sum(p["probability"] for p in sc_punnett if p["status"] == "affected")
    sc_carrier = sum(p["probability"] for p in sc_punnett if p["status"] == "carrier")
    disease_results.append({
        "disease": "Sickle Cell Disease", "gene": "HBB", "chromosome": "11", "inheritance": "Autosomal Recessive",
        "color": "#14b8a6", "parent1Genotype": sc_g1, "parent2Genotype": sc_g2, "punnettSquare": sc_punnett,
        "affectedProb": sc_affected, "carrierProb": sc_carrier, "healthyProb": 1 - sc_affected - sc_carrier,
        "severity": "severe" if sc_affected > 0.2 else "moderate" if sc_carrier > 0.4 else "mild" if sc_carrier > 0 else "none",
        "mutationDetected": "S" in sc_g1 or "S" in sc_g2,
        "mutationDetails": "HBB gene: Glu6Val substitution (sickle mutation)" if ("S" in sc_g1 or "S" in sc_g2) else "No mutation detected",
    })

    # G6PD
    g6_g1 = parent1.genotypes.get("g6pd_deficiency", "XGY")
    g6_g2 = parent2.genotypes.get("g6pd_deficiency", "XGX") if is_dual else "XGX"
    g6_res = g6pd_prediction(g6_g1, g6_g2)
    g6_affected = sum(p["probability"] for p in g6_res["punnett"] if p["status"] == "affected")
    g6_carrier = sum(p["probability"] for p in g6_res["punnett"] if p["status"] == "carrier")
    sex_linked_result = g6_res["sexLinked"]
    disease_results.append({
        "disease": "G6PD Deficiency", "gene": "G6PD", "chromosome": "X", "inheritance": "X-Linked Recessive",
        "color": "#f59e0b", "parent1Genotype": g6_g1, "parent2Genotype": g6_g2, "punnettSquare": g6_res["punnett"],
        "affectedProb": g6_affected, "carrierProb": g6_carrier, "healthyProb": 1 - g6_affected - g6_carrier,
        "severity": "moderate" if g6_affected > 0.3 else "mild" if g6_affected > 0 else "none",
        "mutationDetected": "Xg" in g6_g1 or "Xg" in g6_g2,
        "mutationDetails": "G6PD gene: Enzyme deficiency variant detected" if ("Xg" in g6_g1 or "Xg" in g6_g2) else "No mutation detected",
    })

    # Y-Chromosome Infertility
    y_g1 = parent1.genotypes.get("y_chromosome_infertility", "normal")
    y_g2 = parent2.genotypes.get("y_chromosome_infertility", "normal") if is_dual else "normal"
    y_affected = 0.5 if (y_g1 != "normal" or y_g2 != "normal") else 0
    disease_results.append({
        "disease": "Y-Chromosome Infertility", "gene": "AZF", "chromosome": "Y", "inheritance": "Y-Linked",
        "color": "#f97316", "parent1Genotype": y_g1, "parent2Genotype": y_g2,
        "punnettSquare": [
            {"genotype": "Normal Y", "probability": 1 - y_affected, "status": "healthy"},
            {"genotype": "Deleted AZF", "probability": y_affected, "status": "affected"},
        ],
        "affectedProb": y_affected, "carrierProb": 0, "healthyProb": 1 - y_affected,
        "severity": "severe" if y_affected > 0 else "none",
        "mutationDetected": y_g1 != "normal" or y_g2 != "normal",
        "mutationDetails": f"AZF region: {y_g1.replace('_del', ' deletion').replace('azf', 'AZF')} detected" if y_g1 != "normal" else "No microdeletions detected",
    })

    # Blood Group
    b1, b2 = parent1.blood, (parent2.blood if is_dual else "ii")
    rh1, rh2 = parent1.rh, (parent2.rh if is_dual else "Dd")
    blood_group_res = predict_blood_group(b1, b2, rh1, rh2)

    # Immunity
    immunity_score = calculate_immunity_score(disease_results)

    # Carrier Status Summary
    carrier_status = [
        {
            "disease": d["disease"],
            "probability": d["carrierProb"],
            "status": "High" if d["carrierProb"] > 0.4 else "Moderate" if d["carrierProb"] > 0.2 else "Low" if d["carrierProb"] > 0 else "None"
        }
        for d in disease_results
    ]

    return {
        "diseases": disease_results,
        "bloodGroup": blood_group_res,
        "immunityScore": immunity_score,
        "carrierStatus": carrier_status,
        "sexLinked": sex_linked_result
    }
