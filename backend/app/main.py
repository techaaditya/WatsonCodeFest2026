from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import prediction, chromolens, genoguide, heritage, user

app = FastAPI(
    title="GenoVault API",
    description="Backend API for GenoVault Genomic Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(prediction.router, prefix="/api/prediction", tags=["Prediction"])
app.include_router(chromolens.router, prefix="/api/chromolens", tags=["ChromoLens"])
app.include_router(genoguide.router, prefix="/api/genoguide", tags=["GenoGuide"])
app.include_router(heritage.router, prefix="/api/heritage", tags=["Heritage"])
app.include_router(user.router, prefix="/api/user", tags=["User"])

@app.get("/")
async def root():
    return {"message": "Welcome to GenoVault API", "status": "active"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
