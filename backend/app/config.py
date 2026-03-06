import os
from dataclasses import dataclass, field

@dataclass
class Settings:
    BW_DATABASE_URL: str = field(default_factory=lambda: os.getenv("BW_DATABASE_URL", ""))
    BDC_DATABASE_URL: str = field(default_factory=lambda: os.getenv("BDC_DATABASE_URL", ""))
    ANTHROPIC_API_KEY: str = field(default_factory=lambda: os.getenv("ANTHROPIC_API_KEY", ""))
    AI_MODEL: str = "claude-opus-4-6"
    AI_MAX_TOKENS: int = 4096
    AI_TEMPERATURE: float = 0.0
    CORS_ORIGINS: list = field(default_factory=lambda: ["*"])

settings = Settings()
