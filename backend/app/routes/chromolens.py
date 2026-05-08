from fastapi import APIRouter
from app.services.chromolens import get_all_chromosomes, get_chromosome_info

router = APIRouter()

@router.get("/chromosomes")
async def chromosomes():
    return get_all_chromosomes()

@router.get("/chromosome/{number}")
async def chromosome_detail(number: str):
    return get_chromosome_info(number)
