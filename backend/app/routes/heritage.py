from fastapi import APIRouter, Body
from app.services.heritage import get_heritage_risk_profile

router = APIRouter()

@router.post("/risk-profile")
async def get_risk_profile(region: str = Body(...), ethnicity: str = Body(...)):
    return get_heritage_risk_profile(region, ethnicity)

@router.get("/regions")
async def get_regions():
    return [
        "Province 1 (Koshi)", "Madhesh Pradesh", "Bagmati Pradesh", "Gandaki Pradesh",
        "Lumbini Pradesh", "Karnali Pradesh", "Sudurpashchim Pradesh",
    ]

@router.get("/ethnicities")
async def get_ethnicities():
    return [
        "Brahmin/Chhetri", "Newar", "Tharu", "Tamang", "Magar", "Gurung",
        "Rai/Limbu", "Sherpa", "Madhesi", "Dalit", "Janajati (Other)",
    ]
