import anthropic
from app.config import settings
import json

def classify_dimension(dimension_name: str, description: str, sample_values: list) -> dict:
    """Use Claude to classify a dimension semantically"""

    print(f"[AI] Classifying dimension: {dimension_name}")
    print(f"[AI] Description: {description}")
    print(f"[AI] Sample values: {sample_values}")

    if not settings.ANTHROPIC_API_KEY:
        raise ValueError("ANTHROPIC_API_KEY not configured")

    print(f"[AI] Using model: {settings.AI_MODEL}")
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    prompt = f"""Analyze this SAP BW dimension and classify its semantic type.

Dimension Name: {dimension_name}
Description: {description}
Sample Values: {', '.join(sample_values[:5])}

Classify this dimension into ONE of these semantic types:
- Time (temporal data like dates, periods, fiscal years)
- Geography (locations, regions, countries, cities)
- Organizational (company codes, cost centers, business units)
- Attribute (descriptive characteristics like customer, product, currency)
- KPI (key performance indicators, though rare for dimensions)

Return a JSON object with:
{{
  "semantic_type": "the classification",
  "confidence": 0.0 to 1.0,
  "display_format": "suggested format for display",
  "sort_order": "chronological|geographical|alphanumeric|none",
  "reasoning": "brief explanation of why you chose this classification"
}}

Be concise and confident."""

    try:
        print(f"[AI] Calling Claude API...")
        message = client.messages.create(
            model=settings.AI_MODEL,
            max_tokens=settings.AI_MAX_TOKENS,
            temperature=settings.AI_TEMPERATURE,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        print(f"[AI] API call successful")
        response_text = message.content[0].text
        print(f"[AI] Response: {response_text[:200]}...")
    except Exception as api_error:
        print(f"[AI] API call failed: {type(api_error).__name__}: {str(api_error)}")
        import traceback
        traceback.print_exc()
        raise

    # Extract JSON from response
    try:
        # Find JSON in response
        start = response_text.find('{')
        end = response_text.rfind('}') + 1
        if start >= 0 and end > start:
            json_str = response_text[start:end]
            return json.loads(json_str)
        else:
            # Fallback if no JSON found
            return {
                "semantic_type": "Attribute",
                "confidence": 0.5,
                "display_format": "text",
                "sort_order": "none",
                "reasoning": "Failed to parse AI response"
            }
    except:
        return {
            "semantic_type": "Attribute",
            "confidence": 0.5,
            "display_format": "text",
            "sort_order": "none",
            "reasoning": "Failed to parse AI response"
        }
