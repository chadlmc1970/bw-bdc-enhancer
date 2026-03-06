import os
import anthropic
import json

# Test the AI API directly - use hardcoded key for testing
# Get from user or env
api_key = input("Enter ANTHROPIC_API_KEY (or press Enter to use env): ").strip()
if not api_key:
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
if not api_key:
    print("ERROR: ANTHROPIC_API_KEY not set")
    exit(1)

print(f"API Key configured: {api_key[:10]}...")

client = anthropic.Anthropic(api_key=api_key)

# Test with sample dimension
dimension_name = "0CALMONTH"
description = "Calendar Year/Month"
sample_values = ["202401", "202402", "202403"]

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

print(f"\nTesting with model: claude-opus-4-20250514")
print(f"Prompt length: {len(prompt)}")

try:
    message = client.messages.create(
        model="claude-opus-4-20250514",
        max_tokens=4096,
        temperature=0.0,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    response_text = message.content[0].text
    print(f"\nRaw response:\n{response_text}")

    # Extract JSON
    start = response_text.find('{')
    end = response_text.rfind('}') + 1
    if start >= 0 and end > start:
        json_str = response_text[start:end]
        result = json.loads(json_str)
        print(f"\nParsed JSON:\n{json.dumps(result, indent=2)}")
    else:
        print("\nERROR: No JSON found in response")

except Exception as e:
    print(f"\nERROR: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
