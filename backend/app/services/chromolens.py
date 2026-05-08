from typing import List, Dict, Any

CHROMOSOME_DATA = {
    "11": {
        "name": "Chromosome 11",
        "genes": [
            {"name": "HBB", "position": "11p15.4", "diseases": ["Beta Thalassemia", "Sickle Cell Disease"]}
        ]
    },
    "X": {
        "name": "Chromosome X",
        "genes": [
            {"name": "G6PD", "position": "Xq28", "diseases": ["G6PD Deficiency"]}
        ]
    },
    "Y": {
        "name": "Chromosome Y",
        "genes": [
            {"name": "AZF", "position": "Yq11", "diseases": ["Y-Chromosome Infertility"]}
        ]
    }
}

def get_chromosome_info(number: str) -> Dict[str, Any]:
    return CHROMOSOME_DATA.get(number, {"name": f"Chromosome {number}", "genes": []})

def get_all_chromosomes() -> List[Dict[str, Any]]:
    return [
        {"number": str(i), "info": get_chromosome_info(str(i))}
        for i in range(1, 23)
    ] + [{"number": "X", "info": get_chromosome_info("X")}, {"number": "Y", "info": get_chromosome_info("Y")}]
