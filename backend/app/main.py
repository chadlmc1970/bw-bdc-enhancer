from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(title="BW-BDC Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "BW-BDC Backend Running", "version": "1.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    return {
        "infocubes": 12,
        "dimensions": 48,
        "enhanced_models": 8,
        "ai_confidence": 0.92
    }

@app.get("/api/source/infocubes")
def get_infocubes():
    return [
        {"id": "0FIGL_C10", "name": "Financial Ledger", "dimensions": 15},
        {"id": "0SD_C03", "name": "Sales Data", "dimensions": 12},
        {"id": "0COPC_C01", "name": "Production Costs", "dimensions": 10}
    ]
