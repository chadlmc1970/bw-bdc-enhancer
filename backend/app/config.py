import os
from dataclasses import dataclass, field

@dataclass
class Settings:
    BW_DATABASE_URL: str = field(default_factory=lambda: os.getenv("BW_DATABASE_URL", ""))
    BDC_DATABASE_URL: str = field(default_factory=lambda: os.getenv("BDC_DATABASE_URL", ""))
    CORS_ORIGINS: list = field(default_factory=lambda: ["*"])

settings = Settings()
