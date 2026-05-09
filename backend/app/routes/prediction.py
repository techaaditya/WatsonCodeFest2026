from fastapi import APIRouter, HTTPException
from app.services.genetics.engine import PredictionInput, run_prediction
from app.services.genetics.sickle_cell_ml import analyze_sickle_cell

router = APIRouter()

@router.post("/predict")
async def predict_genetic_outcome(data: PredictionInput):
    try:
        result = run_prediction(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/sickle-cell")
async def predict_sickle_cell(data: PredictionInput):
    try:
        result = analyze_sickle_cell(
            mode=data.mode,
            sequence=data.sequence,
            father_sequence=data.father_sequence,
            mother_sequence=data.mother_sequence
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/diseases")
async def get_supported_diseases():
    return [
        {"id": "beta_thalassemia", "name": "Beta Thalassemia", "gene": "HBB"},
        {"id": "sickle_cell", "name": "Sickle Cell Disease", "gene": "HBB"},
        {"id": "g6pd_deficiency", "name": "G6PD Deficiency", "gene": "G6PD"},
        {"id": "y_chromosome_infertility", "name": "Y-Chromosome Infertility", "gene": "AZF"}
    ]
