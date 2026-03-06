from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import get_bw_engine, get_bdc_engine, init_bw_database, init_bdc_database, reset_databases
from app.ai_engine import classify_dimension
from sqlalchemy import text
from datetime import datetime
import json

app = FastAPI(title="BW-BDC Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize databases on startup
@app.on_event("startup")
async def startup():
    try:
        init_bw_database()
        init_bdc_database()
    except Exception as e:
        print(f"Database initialization error: {e}")

@app.get("/")
def read_root():
    return {"status": "BW-BDC Backend Running", "version": "2.0 - REAL AI"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "ai_configured": bool(settings.ANTHROPIC_API_KEY)}

@app.post("/api/reset")
def reset_system():
    """Reset databases to clean state"""
    try:
        reset_databases()
        return {"status": "success", "message": "Databases reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    bw_engine = get_bw_engine()
    bdc_engine = get_bdc_engine()

    with bw_engine.connect() as conn:
        result = conn.execute(text("SELECT COUNT(*) FROM bw_source.infocubes"))
        infocubes = result.scalar() or 0

        result = conn.execute(text("SELECT COUNT(*) FROM bw_source.dimensions"))
        dimensions = result.scalar() or 0

    with bdc_engine.connect() as conn:
        result = conn.execute(text("SELECT COUNT(*) FROM bdc_target.datasphere_models"))
        enhanced_models = result.scalar() or 0

        result = conn.execute(text("SELECT AVG(ai_confidence_score) FROM bdc_target.datasphere_models"))
        ai_confidence = result.scalar() or 0.0

    return {
        "infocubes": infocubes,
        "dimensions": dimensions,
        "enhanced_models": enhanced_models,
        "ai_confidence": round(float(ai_confidence), 2) if ai_confidence else 0.0
    }

@app.get("/api/source/infocubes")
def get_infocubes():
    bw_engine = get_bw_engine()
    bdc_engine = get_bdc_engine()

    with bw_engine.connect() as conn:
        result = conn.execute(text("""
            SELECT infocube_id, description, record_count
            FROM bw_source.infocubes
            ORDER BY infocube_id
        """))

        infocubes = []
        for row in result:
            # Check if enhanced
            with bdc_engine.connect() as bdc_conn:
                enhanced = bdc_conn.execute(text("""
                    SELECT COUNT(*) FROM bdc_target.datasphere_models
                    WHERE source_infocube_id = :id
                """), {"id": row[0]}).scalar()

            # Count dimensions
            dim_count = conn.execute(text("""
                SELECT COUNT(*) FROM bw_source.dimensions WHERE infocube_id = :id
            """), {"id": row[0]}).scalar()

            infocubes.append({
                "id": row[0],
                "name": row[1],
                "dimensions": dim_count,
                "status": "enhanced" if enhanced > 0 else "pending"
            })

        return infocubes

@app.post("/api/enhancement/start")
def start_enhancement(request: dict):
    """Start real AI enhancement process"""
    infocube_id = request.get("infocube_id")

    if not infocube_id:
        raise HTTPException(status_code=400, detail="infocube_id required")

    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not configured")

    bw_engine = get_bw_engine()
    bdc_engine = get_bdc_engine()

    # Get InfoCube info
    with bw_engine.connect() as conn:
        result = conn.execute(text("""
            SELECT description FROM bw_source.infocubes WHERE infocube_id = :id
        """), {"id": infocube_id})
        row = result.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="InfoCube not found")

        infocube_name = row[0]

        # Get dimensions
        result = conn.execute(text("""
            SELECT dimension_id, dimension_name, description, sample_values
            FROM bw_source.dimensions
            WHERE infocube_id = :id
        """), {"id": infocube_id})

        dimensions = []
        total_confidence = 0.0

        for dim_row in result:
            dim_id, dim_name, description, sample_json = dim_row
            sample_values = json.loads(sample_json) if sample_json else []

            # REAL AI CLASSIFICATION
            classification = classify_dimension(dim_name, description, sample_values)

            dimensions.append({
                "dimension_id": dim_id,
                "dimension_name": dim_name,
                "description": description,
                "semantic_type": classification["semantic_type"],
                "confidence": classification["confidence"],
                "reasoning": classification["reasoning"],
                "display_format": classification["display_format"],
                "sort_order": classification["sort_order"]
            })

            total_confidence += classification["confidence"]

        avg_confidence = total_confidence / len(dimensions) if dimensions else 0.0

        # Write to BDC database
        model_id = f"MODEL_{infocube_id}"

        with bdc_engine.connect() as bdc_conn:
            # Delete existing
            bdc_conn.execute(text("""
                DELETE FROM bdc_target.dimensions WHERE model_id = :id
            """), {"id": model_id})

            bdc_conn.execute(text("""
                DELETE FROM bdc_target.datasphere_models WHERE model_id = :id
            """), {"id": model_id})

            # Insert model
            bdc_conn.execute(text("""
                INSERT INTO bdc_target.datasphere_models
                (model_id, model_name, source_infocube_id, enhanced_at, ai_confidence_score, status)
                VALUES (:model_id, :name, :source_id, :enhanced_at, :confidence, :status)
            """), {
                "model_id": model_id,
                "name": infocube_name,
                "source_id": infocube_id,
                "enhanced_at": datetime.utcnow(),
                "confidence": round(avg_confidence, 2),
                "status": "completed"
            })

            # Insert dimensions
            for dim in dimensions:
                bdc_conn.execute(text("""
                    INSERT INTO bdc_target.dimensions
                    (dimension_id, model_id, dimension_name, source_dimension_id, ai_semantic_type,
                     ai_confidence, ai_reasoning, display_format, sort_order)
                    VALUES (:dim_id, :model_id, :dim_name, :source_id, :semantic_type,
                            :confidence, :reasoning, :display_format, :sort_order)
                """), {
                    "dim_id": f"{model_id}_{dim['dimension_name']}",
                    "model_id": model_id,
                    "dim_name": dim['dimension_name'],
                    "source_id": dim['dimension_id'],
                    "semantic_type": dim['semantic_type'],
                    "confidence": dim['confidence'],
                    "reasoning": dim['reasoning'],
                    "display_format": dim['display_format'],
                    "sort_order": dim['sort_order']
                })

            bdc_conn.commit()

        return {
            "status": "completed",
            "infocube_id": infocube_id,
            "model_id": model_id,
            "dimensions_processed": len(dimensions),
            "avg_confidence": round(avg_confidence, 2)
        }

@app.get("/api/enhancement/{infocube_id}")
def get_enhancement_details(infocube_id: str):
    """Get real enhancement results from database"""
    bdc_engine = get_bdc_engine()
    model_id = f"MODEL_{infocube_id}"

    with bdc_engine.connect() as conn:
        # Get model
        result = conn.execute(text("""
            SELECT model_name, enhanced_at, ai_confidence_score
            FROM bdc_target.datasphere_models
            WHERE model_id = :id
        """), {"id": model_id})

        row = result.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Enhancement not found")

        model_name, enhanced_at, confidence = row

        # Get dimensions
        result = conn.execute(text("""
            SELECT dimension_name, ai_semantic_type, ai_confidence, ai_reasoning,
                   display_format, sort_order
            FROM bdc_target.dimensions
            WHERE model_id = :id
        """), {"id": model_id})

        dimensions = []
        for dim_row in result:
            dimensions.append({
                "original_name": dim_row[0],
                "description": dim_row[0],
                "semantic_type": dim_row[1],
                "ai_confidence": float(dim_row[2]),
                "reasoning": dim_row[3],
                "display_format": dim_row[4],
                "sort_order": dim_row[5]
            })

        return {
            "infocube_id": infocube_id,
            "infocube_name": model_name,
            "enhanced_at": enhanced_at.isoformat() if enhanced_at else None,
            "ai_model": "claude-opus-4-6",
            "overall_confidence": float(confidence),
            "dimensions": dimensions,
            "hierarchies": [],
            "formulas": [],
            "data_quality": {
                "overall_score": 0.0,
                "completeness": 0.0,
                "consistency": 0.0,
                "accuracy": 0.0,
                "issues": [],
                "recommendations": []
            }
        }
