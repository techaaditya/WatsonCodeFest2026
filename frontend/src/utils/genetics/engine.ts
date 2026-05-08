// Core genetic prediction engine — runs client-side for demo, will be moved to backend

export interface PredictionInput {
  mode: "dual" | "single";
  parent1: { genotypes: Record<string, string>; blood: string; rh: string };
  parent2: { genotypes: Record<string, string>; blood: string; rh: string } | null;
}

export interface DiseaseResult {
  disease: string;
  gene: string;
  chromosome: string;
  inheritance: string;
  color: string;
  parent1Genotype: string;
  parent2Genotype: string;
  punnettSquare: { genotype: string; probability: number; status: string }[];
  affectedProb: number;
  carrierProb: number;
  healthyProb: number;
  severity: "none" | "mild" | "moderate" | "severe";
  mutationDetected: boolean;
  mutationDetails: string;
}

export interface BloodGroupResult {
  possibleGroups: { group: string; probability: number }[];
  possibleRh: { type: string; probability: number }[];
  combined: { type: string; probability: number }[];
}

export interface SexLinkedResult {
  maleChild: { status: string; probability: number }[];
  femaleChild: { status: string; probability: number }[];
}

export interface PredictionResult {
  diseases: DiseaseResult[];
  bloodGroup: BloodGroupResult;
  immunityScore: number;
  carrierStatus: { disease: string; probability: number; status: string }[];
  sexLinked: SexLinkedResult;
}

// Punnett square for autosomal recessive (2-allele)
function autosomalPunnett(g1: string, g2: string): { genotype: string; probability: number; status: string }[] {
  const a1 = [g1[0], g1[1]];
  const a2 = [g2[0], g2[1]];
  const combos: Record<string, number> = {};
  for (const x of a1) {
    for (const y of a2) {
      const sorted = x <= y ? x + y : y + x;
      combos[sorted] = (combos[sorted] || 0) + 0.25;
    }
  }
  return Object.entries(combos).map(([genotype, probability]) => {
    const upper = genotype.toUpperCase();
    const lower = genotype.toLowerCase();
    let status = "healthy";
    if (genotype === lower) status = "affected";
    else if (genotype !== upper) status = "carrier";
    return { genotype, probability, status };
  });
}

// Punnett for sickle cell (A/S alleles)
function sickleCellPunnett(g1: string, g2: string): { genotype: string; probability: number; status: string }[] {
  const a1 = [g1[0], g1[1]];
  const a2 = [g2[0], g2[1]];
  const combos: Record<string, number> = {};
  for (const x of a1) {
    for (const y of a2) {
      const sorted = x <= y ? x + y : y + x;
      combos[sorted] = (combos[sorted] || 0) + 0.25;
    }
  }
  return Object.entries(combos).map(([genotype, probability]) => {
    let status = "healthy";
    if (genotype === "SS") status = "affected";
    else if (genotype === "AS") status = "carrier";
    return { genotype, probability, status };
  });
}

// G6PD X-linked prediction
function g6pdPrediction(g1: string, g2: string): {
  punnett: { genotype: string; probability: number; status: string }[];
  sexLinked: SexLinkedResult;
} {
  // Determine X chromosomes from each parent
  // For simplicity: if male (XY), his X is either Xg or XG
  // If female (XX), she has two X alleles
  const isMale1 = g1.includes("Y");
  const isFemale2 = !g2.includes("Y");

  // Get alleles
  let motherXAlleles: string[] = [];
  let fatherXAllele = "";

  if (isMale1 && isFemale2) {
    // Parent1=father, Parent2=mother
    fatherXAllele = g1.includes("Xg") ? "Xg" : "XG";
    if (g2 === "XGXg") motherXAlleles = ["XG", "Xg"];
    else if (g2 === "XgXg") motherXAlleles = ["Xg", "Xg"];
    else motherXAlleles = ["XG", "XG"];
  } else if (!isMale1 && !isFemale2) {
    // Parent1=mother, Parent2=father
    fatherXAllele = g2.includes("Xg") ? "Xg" : "XG";
    if (g1 === "XGXg") motherXAlleles = ["XG", "Xg"];
    else if (g1 === "XgXg") motherXAlleles = ["Xg", "Xg"];
    else motherXAlleles = ["XG", "XG"];
  } else {
    // Both same sex — approximate
    motherXAlleles = ["XG", "Xg"];
    fatherXAllele = "XG";
  }

  const maleResults: Record<string, { count: number; status: string }> = {};
  const femaleResults: Record<string, { count: number; status: string }> = {};

  for (const mx of motherXAlleles) {
    // Sons get mother's X + Y
    const sonGenotype = `${mx}Y`;
    const sonStatus = mx === "Xg" ? "affected" : "healthy";
    maleResults[sonGenotype] = maleResults[sonGenotype] || { count: 0, status: sonStatus };
    maleResults[sonGenotype].count++;

    // Daughters get mother's X + father's X
    const daughterGenotype = [mx, fatherXAllele].sort().join("");
    const daughterStatus = mx === "Xg" && fatherXAllele === "Xg" ? "affected" : mx === "Xg" || fatherXAllele === "Xg" ? "carrier" : "healthy";
    femaleResults[daughterGenotype] = femaleResults[daughterGenotype] || { count: 0, status: daughterStatus };
    femaleResults[daughterGenotype].count++;
  }

  const total = motherXAlleles.length;
  const maleChild = Object.entries(maleResults).map(([, v]) => ({ status: v.status, probability: v.count / total }));
  const femaleChild = Object.entries(femaleResults).map(([, v]) => ({ status: v.status, probability: v.count / total }));

  const allResults: { genotype: string; probability: number; status: string }[] = [];
  Object.entries(maleResults).forEach(([g, v]) => allResults.push({ genotype: g, probability: (v.count / total) * 0.5, status: v.status }));
  Object.entries(femaleResults).forEach(([g, v]) => allResults.push({ genotype: g, probability: (v.count / total) * 0.5, status: v.status }));

  return { punnett: allResults, sexLinked: { maleChild, femaleChild } };
}

// Blood group prediction
function predictBloodGroup(b1: string, b2: string, rh1: string, rh2: string): BloodGroupResult {
  // ABO alleles
  const aboAlleles: Record<string, string[]> = {
    IAIA: ["IA", "IA"], IAi: ["IA", "i"], IBIB: ["IB", "IB"], IBi: ["IB", "i"],
    IAIB: ["IA", "IB"], ii: ["i", "i"],
  };
  const a1 = aboAlleles[b1] || ["i", "i"];
  const a2 = aboAlleles[b2] || ["i", "i"];
  const aboCombos: Record<string, number> = {};
  for (const x of a1) {
    for (const y of a2) {
      const sorted = [x, y].sort().join("");
      aboCombos[sorted] = (aboCombos[sorted] || 0) + 0.25;
    }
  }
  const genotypeToGroup: Record<string, string> = {
    IAIA: "A", IAi: "A", iIA: "A", IBIB: "B", IBi: "B", iIB: "B",
    IAIB: "AB", IBIA: "AB", ii: "O",
  };
  const groupProbs: Record<string, number> = {};
  Object.entries(aboCombos).forEach(([g, p]) => {
    const group = genotypeToGroup[g] || "O";
    groupProbs[group] = (groupProbs[group] || 0) + p;
  });
  const possibleGroups = Object.entries(groupProbs).map(([group, probability]) => ({ group, probability }));

  // Rh factor
  const r1 = [rh1[0], rh1[1]];
  const r2 = [rh2[0], rh2[1]];
  const rhCombos: Record<string, number> = {};
  for (const x of r1) {
    for (const y of r2) {
      const sorted = x <= y ? x + y : y + x;
      rhCombos[sorted] = (rhCombos[sorted] || 0) + 0.25;
    }
  }
  const rhProbs: Record<string, number> = {};
  Object.entries(rhCombos).forEach(([g, p]) => {
    const type = g === "dd" ? "Rh−" : "Rh+";
    rhProbs[type] = (rhProbs[type] || 0) + p;
  });
  const possibleRh = Object.entries(rhProbs).map(([type, probability]) => ({ type, probability }));

  // Combined
  const combined: { type: string; probability: number }[] = [];
  possibleGroups.forEach((g) => {
    possibleRh.forEach((r) => {
      combined.push({ type: `${g.group}${r.type === "Rh+" ? "+" : "−"}`, probability: g.probability * r.probability });
    });
  });

  return { possibleGroups, possibleRh, combined: combined.filter((c) => c.probability > 0) };
}

// Calculate immunity score
function calculateImmunityScore(diseases: DiseaseResult[]): number {
  if (diseases.length === 0) return 85;
  const weights: Record<string, number> = { severe: 0.4, moderate: 0.25, mild: 0.15, none: 0.05 };
  let jointRisk = 0;
  diseases.forEach((d) => {
    const w = weights[d.severity] || 0.1;
    jointRisk += d.affectedProb * w;
  });
  const avgRisk = jointRisk / diseases.length;
  const score = Math.round(Math.max(0, Math.min(100, (1 - avgRisk * 3) * 100)));
  return score;
}

export function runPrediction(input: PredictionInput): PredictionResult {
  const { parent1, parent2 } = input;
  const isDual = input.mode === "dual" && parent2 !== null;

  const diseaseResults: DiseaseResult[] = [];
  let sexLinkedResult: SexLinkedResult = { maleChild: [], femaleChild: [] };

  // Beta Thalassemia
  const btG1 = parent1.genotypes.beta_thalassemia || "AA";
  const btG2 = isDual ? (parent2?.genotypes.beta_thalassemia || "AA") : "AA";
  const btPunnett = autosomalPunnett(btG1, btG2);
  const btAffected = btPunnett.filter((p) => p.status === "affected").reduce((s, p) => s + p.probability, 0);
  const btCarrier = btPunnett.filter((p) => p.status === "carrier").reduce((s, p) => s + p.probability, 0);
  diseaseResults.push({
    disease: "Beta Thalassemia", gene: "HBB", chromosome: "11", inheritance: "Autosomal Recessive",
    color: "#10b981", parent1Genotype: btG1, parent2Genotype: btG2, punnettSquare: btPunnett,
    affectedProb: btAffected, carrierProb: btCarrier, healthyProb: 1 - btAffected - btCarrier,
    severity: btAffected > 0.2 ? "severe" : btCarrier > 0.4 ? "moderate" : btCarrier > 0 ? "mild" : "none",
    mutationDetected: btG1.includes("a") || btG2.includes("a"),
    mutationDetails: btG1.includes("a") || btG2.includes("a") ? "HBB gene mutation detected: β-globin chain variant" : "No mutation detected",
  });

  // Sickle Cell
  const scG1 = parent1.genotypes.sickle_cell || "AA";
  const scG2 = isDual ? (parent2?.genotypes.sickle_cell || "AA") : "AA";
  const scPunnett = sickleCellPunnett(scG1, scG2);
  const scAffected = scPunnett.filter((p) => p.status === "affected").reduce((s, p) => s + p.probability, 0);
  const scCarrier = scPunnett.filter((p) => p.status === "carrier").reduce((s, p) => s + p.probability, 0);
  diseaseResults.push({
    disease: "Sickle Cell Disease", gene: "HBB", chromosome: "11", inheritance: "Autosomal Recessive",
    color: "#14b8a6", parent1Genotype: scG1, parent2Genotype: scG2, punnettSquare: scPunnett,
    affectedProb: scAffected, carrierProb: scCarrier, healthyProb: 1 - scAffected - scCarrier,
    severity: scAffected > 0.2 ? "severe" : scCarrier > 0.4 ? "moderate" : scCarrier > 0 ? "mild" : "none",
    mutationDetected: scG1.includes("S") || scG2.includes("S"),
    mutationDetails: scG1.includes("S") || scG2.includes("S") ? "HBB gene: Glu6Val substitution (sickle mutation)" : "No mutation detected",
  });

  // G6PD
  const g6G1 = parent1.genotypes.g6pd_deficiency || "XGY";
  const g6G2 = isDual ? (parent2?.genotypes.g6pd_deficiency || "XGX") : "XGX";
  const g6Result = g6pdPrediction(g6G1, g6G2);
  const g6Affected = g6Result.punnett.filter((p) => p.status === "affected").reduce((s, p) => s + p.probability, 0);
  const g6Carrier = g6Result.punnett.filter((p) => p.status === "carrier").reduce((s, p) => s + p.probability, 0);
  sexLinkedResult = g6Result.sexLinked;
  diseaseResults.push({
    disease: "G6PD Deficiency", gene: "G6PD", chromosome: "X", inheritance: "X-Linked Recessive",
    color: "#f59e0b", parent1Genotype: g6G1, parent2Genotype: g6G2, punnettSquare: g6Result.punnett,
    affectedProb: g6Affected, carrierProb: g6Carrier, healthyProb: 1 - g6Affected - g6Carrier,
    severity: g6Affected > 0.3 ? "moderate" : g6Affected > 0 ? "mild" : "none",
    mutationDetected: g6G1.includes("Xg") || g6G2.includes("Xg"),
    mutationDetails: g6G1.includes("Xg") || g6G2.includes("Xg") ? "G6PD gene: Enzyme deficiency variant detected" : "No mutation detected",
  });

  // Y-Chromosome Infertility
  const yG1 = parent1.genotypes.y_chromosome_infertility || "normal";
  const yG2 = isDual ? (parent2?.genotypes.y_chromosome_infertility || "normal") : "normal";
  const yAffected = (yG1 !== "normal" || yG2 !== "normal") ? 0.5 : 0;
  diseaseResults.push({
    disease: "Y-Chromosome Infertility", gene: "AZF", chromosome: "Y", inheritance: "Y-Linked",
    color: "#f97316", parent1Genotype: yG1, parent2Genotype: yG2,
    punnettSquare: [
      { genotype: "Normal Y", probability: 1 - yAffected, status: "healthy" },
      { genotype: "Deleted AZF", probability: yAffected, status: "affected" },
    ],
    affectedProb: yAffected, carrierProb: 0, healthyProb: 1 - yAffected,
    severity: yAffected > 0 ? "severe" : "none",
    mutationDetected: yG1 !== "normal" || yG2 !== "normal",
    mutationDetails: yG1 !== "normal" ? `AZF region: ${yG1.replace("_del", " deletion").replace("azf", "AZF")} detected` : "No microdeletions detected",
  });

  // Blood group
  const b1 = parent1.blood || "ii";
  const b2 = isDual ? (parent2?.blood || "ii") : "ii";
  const rh1 = parent1.rh || "Dd";
  const rh2 = isDual ? (parent2?.rh || "Dd") : "Dd";
  const bloodGroup = predictBloodGroup(b1, b2, rh1, rh2);

  // Immunity
  const immunityScore = calculateImmunityScore(diseaseResults);

  // Carrier status summary
  const carrierStatus = diseaseResults.map((d) => ({
    disease: d.disease,
    probability: d.carrierProb,
    status: d.carrierProb > 0.4 ? "High" : d.carrierProb > 0.2 ? "Moderate" : d.carrierProb > 0 ? "Low" : "None",
  }));

  return { diseases: diseaseResults, bloodGroup, immunityScore, carrierStatus, sexLinked: sexLinkedResult };
}
