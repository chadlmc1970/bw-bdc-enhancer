from sqlalchemy import create_engine, text
from app.config import settings

def get_bw_engine():
    return create_engine(settings.BW_DATABASE_URL)

def get_bdc_engine():
    return create_engine(settings.BDC_DATABASE_URL)

def init_bw_database():
    """Initialize BW source database with sample InfoCube data"""
    engine = get_bw_engine()
    with engine.connect() as conn:
        # Create schema
        conn.execute(text("CREATE SCHEMA IF NOT EXISTS bw_source"))
        conn.commit()

        # Create tables
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS bw_source.infocubes (
                infocube_id VARCHAR(30) PRIMARY KEY,
                description TEXT,
                cube_type VARCHAR(20),
                record_count BIGINT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        """))

        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS bw_source.dimensions (
                dimension_id VARCHAR(50) PRIMARY KEY,
                infocube_id VARCHAR(30),
                dimension_name VARCHAR(100),
                description TEXT,
                data_type VARCHAR(20),
                sample_values JSONB
            )
        """))

        conn.commit()

        # Insert sample data
        conn.execute(text("""
            INSERT INTO bw_source.infocubes (infocube_id, description, cube_type, record_count)
            VALUES
                ('0FIGL_C10', 'Financial Ledger', 'Standard', 1500000),
                ('0SD_C03', 'Sales Data', 'Standard', 2300000),
                ('0COPC_C01', 'Production Costs', 'Standard', 890000)
            ON CONFLICT (infocube_id) DO NOTHING
        """))

        conn.execute(text("""
            INSERT INTO bw_source.dimensions (dimension_id, infocube_id, dimension_name, description, data_type, sample_values)
            VALUES
                ('0FIGL_C10_FISCPER', '0FIGL_C10', '0FISCPER', 'Fiscal Period', 'CHAR', '["202401", "202402", "202403"]'::jsonb),
                ('0FIGL_C10_COMP', '0FIGL_C10', '0COMP_CODE', 'Company Code', 'CHAR', '["1000", "2000", "3000"]'::jsonb),
                ('0FIGL_C10_CUSTOMER', '0FIGL_C10', '0CUSTOMER', 'Customer Number', 'CHAR', '["CUST001", "CUST002", "CUST003"]'::jsonb),
                ('0FIGL_C10_CURRENCY', '0FIGL_C10', '0CURRENCY', 'Currency Key', 'CHAR', '["USD", "EUR", "GBP"]'::jsonb),
                ('0FIGL_C10_REGION', '0FIGL_C10', '0REGION', 'Sales Region', 'CHAR', '["North America", "EMEA", "APAC"]'::jsonb),
                ('0SD_C03_DATE', '0SD_C03', '0CALDAY', 'Calendar Day', 'DATE', '["2024-01-01", "2024-01-02"]'::jsonb),
                ('0SD_C03_PRODUCT', '0SD_C03', '0MATERIAL', 'Material Number', 'CHAR', '["MAT001", "MAT002"]'::jsonb),
                ('0COPC_C01_PLANT', '0COPC_C01', '0PLANT', 'Plant', 'CHAR', '["PL01", "PL02"]'::jsonb)
            ON CONFLICT (dimension_id) DO NOTHING
        """))

        conn.commit()

def init_bdc_database():
    """Initialize BDC target database"""
    engine = get_bdc_engine()
    with engine.connect() as conn:
        conn.execute(text("CREATE SCHEMA IF NOT EXISTS bdc_target"))
        conn.commit()

        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS bdc_target.datasphere_models (
                model_id VARCHAR(50) PRIMARY KEY,
                model_name VARCHAR(100),
                source_infocube_id VARCHAR(30),
                enhanced_at TIMESTAMPTZ,
                ai_confidence_score NUMERIC(3,2),
                status VARCHAR(20)
            )
        """))

        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS bdc_target.dimensions (
                dimension_id VARCHAR(50) PRIMARY KEY,
                model_id VARCHAR(50),
                dimension_name VARCHAR(100),
                source_dimension_id VARCHAR(50),
                ai_semantic_type VARCHAR(50),
                ai_confidence NUMERIC(3,2),
                ai_reasoning TEXT,
                display_format VARCHAR(50),
                sort_order VARCHAR(50)
            )
        """))

        conn.commit()

def reset_databases():
    """Reset both databases to clean state"""
    bw_engine = get_bw_engine()
    bdc_engine = get_bdc_engine()

    with bw_engine.connect() as conn:
        conn.execute(text("DROP SCHEMA IF EXISTS bw_source CASCADE"))
        conn.commit()

    with bdc_engine.connect() as conn:
        conn.execute(text("DROP SCHEMA IF EXISTS bdc_target CASCADE"))
        conn.commit()

    init_bw_database()
    init_bdc_database()
