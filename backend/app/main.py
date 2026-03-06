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
        {"id": "0FIGL_C10", "name": "Financial Ledger", "dimensions": 15, "status": "enhanced"},
        {"id": "0SD_C03", "name": "Sales Data", "dimensions": 12, "status": "pending"},
        {"id": "0COPC_C01", "name": "Production Costs", "dimensions": 10, "status": "pending"}
    ]

@app.get("/api/enhancement/{infocube_id}")
def get_enhancement_details(infocube_id: str):
    # Mock AI enhancement results
    return {
        "infocube_id": infocube_id,
        "infocube_name": "Financial Ledger" if infocube_id == "0FIGL_C10" else "Unknown",
        "enhanced_at": "2026-03-06T10:30:00Z",
        "ai_model": "claude-opus-4-6",
        "overall_confidence": 0.94,

        "dimensions": [
            {
                "original_name": "0FISCPER",
                "description": "Fiscal Period",
                "semantic_type": "Time",
                "ai_confidence": 0.98,
                "display_format": "YYYY/MM",
                "sort_order": "chronological",
                "reasoning": "Field contains fiscal period data with year/month structure. Identified as temporal dimension based on naming convention and sample values (202401, 202402)."
            },
            {
                "original_name": "0COMP_CODE",
                "description": "Company Code",
                "semantic_type": "Organizational",
                "ai_confidence": 0.95,
                "display_format": "4-digit code",
                "sort_order": "alphanumeric",
                "reasoning": "Company code represents organizational hierarchy. Analysis of sample values (1000, 2000, 3000) indicates company-level segmentation."
            },
            {
                "original_name": "0CUSTOMER",
                "description": "Customer Number",
                "semantic_type": "Attribute",
                "ai_confidence": 0.92,
                "display_format": "10-digit ID",
                "sort_order": "none",
                "reasoning": "Customer identifier is a descriptive attribute. High cardinality and alphanumeric pattern suggest entity dimension rather than measure."
            },
            {
                "original_name": "0CURRENCY",
                "description": "Currency Key",
                "semantic_type": "Attribute",
                "ai_confidence": 0.99,
                "display_format": "ISO 4217",
                "sort_order": "alphabetical",
                "reasoning": "Currency codes follow ISO 4217 standard (USD, EUR, GBP). Clear attribute dimension for financial reporting."
            },
            {
                "original_name": "0REGION",
                "description": "Sales Region",
                "semantic_type": "Geography",
                "ai_confidence": 0.96,
                "display_format": "Region name",
                "sort_order": "geographical",
                "reasoning": "Geographic dimension identified through regional naming patterns. Sample values indicate sales territories (North America, EMEA, APAC)."
            }
        ],

        "hierarchies": [
            {
                "name": "Time Hierarchy",
                "type": "Time",
                "ai_confidence": 0.97,
                "levels": [
                    {"level": 1, "dimension": "Fiscal Year", "cardinality": 5},
                    {"level": 2, "dimension": "Fiscal Quarter", "cardinality": 20},
                    {"level": 3, "dimension": "Fiscal Period", "cardinality": 60}
                ],
                "reasoning": "Detected natural time hierarchy from fiscal period dimension. Parent-child relationships confirmed through data analysis."
            },
            {
                "name": "Organizational Hierarchy",
                "type": "Organizational",
                "ai_confidence": 0.93,
                "levels": [
                    {"level": 1, "dimension": "Company Code", "cardinality": 3},
                    {"level": 2, "dimension": "Business Unit", "cardinality": 12},
                    {"level": 3, "dimension": "Cost Center", "cardinality": 48}
                ],
                "reasoning": "Company structure hierarchy identified through organizational dimension relationships. Validated against typical SAP organizational model."
            }
        ],

        "formulas": [
            {
                "original_name": "ZNET_REV",
                "description": "Net Revenue",
                "bw_formula": "( GROSS_REV - DISCOUNT ) * EXCHANGE_RATE",
                "datasphere_formula": "( [GROSS_REV] - [DISCOUNT] ) * [EXCHANGE_RATE]",
                "ai_confidence": 0.91,
                "reasoning": "Translated BW calculation syntax to Datasphere SQL expression. Verified operand references and operator precedence."
            },
            {
                "original_name": "ZPROFIT_MARGIN",
                "description": "Profit Margin %",
                "bw_formula": "( NET_REV - TOTAL_COST ) / NET_REV * 100",
                "datasphere_formula": "CASE WHEN [NET_REV] = 0 THEN 0 ELSE ( [NET_REV] - [TOTAL_COST] ) / [NET_REV] * 100 END",
                "ai_confidence": 0.95,
                "reasoning": "Added division-by-zero protection in Datasphere version. Converted to CASE statement for safe calculation."
            }
        ],

        "data_quality": {
            "overall_score": 0.87,
            "completeness": 0.92,
            "consistency": 0.85,
            "accuracy": 0.84,
            "issues": [
                {
                    "severity": "medium",
                    "dimension": "0CUSTOMER",
                    "issue_type": "null_values",
                    "count": 342,
                    "percentage": 3.2,
                    "description": "3.2% of customer records have NULL values"
                },
                {
                    "severity": "low",
                    "dimension": "0REGION",
                    "issue_type": "inconsistent_format",
                    "count": 87,
                    "percentage": 0.8,
                    "description": "Mixed case formatting detected (e.g., 'North America' vs 'NORTH AMERICA')"
                },
                {
                    "severity": "high",
                    "dimension": "0CURRENCY",
                    "issue_type": "invalid_values",
                    "count": 23,
                    "percentage": 0.2,
                    "description": "23 records contain non-ISO currency codes"
                }
            ],
            "recommendations": [
                "Implement NULL handling for customer dimension in ETL pipeline",
                "Standardize region names to title case format",
                "Add validation rule to enforce ISO 4217 currency codes"
            ]
        }
    }
