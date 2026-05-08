from typing import List, Dict, Any

RISK_DATABASE = {
    "Madhesh Pradesh": {
        "Tharu": [
            { "disease": "Sickle Cell Disease", "gene": "HBB", "prevalence": "5-15% carrier rate", "risk": "High",
              "reason": "Sickle cell trait is prevalent in Tharu communities as it historically provided malaria resistance in the Terai lowlands.",
              "screening": "Hemoglobin electrophoresis, CBC with peripheral smear",
              "environmental": ["Malaria-endemic region", "Hot and humid climate", "Limited healthcare access"] },
            { "disease": "Beta Thalassemia", "gene": "HBB", "prevalence": "3-5% carrier rate", "risk": "Moderate",
              "reason": "Beta-globin mutations are common across South Asian populations including Terai communities.",
              "screening": "Complete blood count, HbA2 levels, genetic testing",
              "environmental": ["Iron-poor diet in some communities", "Limited genetic screening access"] },
            { "disease": "G6PD Deficiency", "gene": "G6PD", "prevalence": "3-8%", "risk": "Moderate",
              "reason": "X-linked condition found across South Asian populations, particularly in malaria-endemic areas.",
              "screening": "G6PD enzyme assay, fluorescent spot test",
              "environmental": ["Fava bean consumption", "Use of traditional medicines", "Antimalarial drug exposure"] },
        ],
        "Madhesi": [
            { "disease": "Beta Thalassemia", "gene": "HBB", "prevalence": "4-7% carrier rate", "risk": "High",
              "reason": "High carrier frequency in Indo-Gangetic plain populations with limited awareness and screening.",
              "screening": "HbA2 quantification, HPLC, genetic testing",
              "environmental": ["High consanguinity rates", "Limited genetic counseling"] },
            { "disease": "Sickle Cell Disease", "gene": "HBB", "prevalence": "2-4%", "risk": "Moderate",
              "reason": "Found in certain Madhesi sub-communities, especially those near malaria-endemic zones.",
              "screening": "Sickle solubility test, hemoglobin electrophoresis",
              "environmental": ["Malaria exposure history", "Limited healthcare infrastructure"] },
        ],
    },
    "Bagmati Pradesh": {
        "Newar": [
            { "disease": "Beta Thalassemia", "gene": "HBB", "prevalence": "2-4% carrier rate", "risk": "Moderate",
              "reason": "Beta thalassemia carriers have been identified in Kathmandu Valley's Newar population.",
              "screening": "CBC, hemoglobin analysis, genetic counseling",
              "environmental": ["Urban lifestyle", "Better healthcare access but low awareness"] },
            { "disease": "G6PD Deficiency", "gene": "G6PD", "prevalence": "1-3%", "risk": "Low",
              "reason": "Lower prevalence compared to Terai populations but still present.",
              "screening": "G6PD enzyme activity test",
              "environmental": ["Varied diet", "Urban healthcare availability"] },
        ],
    },
}

def get_default_risks(region: str, ethnicity: str) -> List[Dict[str, Any]]:
    return [
        { "disease": "Beta Thalassemia", "gene": "HBB", "prevalence": "2-5% estimated carrier rate", "risk": "Moderate",
          "reason": f"Beta thalassemia is present across Nepal including {region}. Limited screening in {ethnicity} communities means carrier rates may be underestimated.",
          "screening": "Complete blood count, HbA2 levels, genetic testing recommended",
          "environmental": ["Limited genetic screening infrastructure", "Low public awareness of carrier status"] },
        { "disease": "G6PD Deficiency", "gene": "G6PD", "prevalence": "1-5%", "risk": "Low",
          "reason": "Found across South Asian populations. Prevalence varies by specific community and geography.",
          "screening": "G6PD enzyme assay recommended, especially before prescribing antimalarials",
          "environmental": ["Diet and medication awareness important", "Traditional medicine interactions possible"] },
    ]

def get_heritage_risk_profile(region: str, ethnicity: str) -> List[Dict[str, Any]]:
    region_data = RISK_DATABASE.get(region)
    if region_data:
        ethnic_data = region_data.get(ethnicity)
        if ethnic_data:
            return ethnic_data
    return get_default_risks(region, ethnicity)
