import math
from typing import Tuple, Dict, Any
from .models_schema import ConfidenceInterval

def calculate_composite_risk(heart_risk: float, diabetes_risk: float, stroke_risk: float) -> float:
    """
    Weighted average of individual disease probabilities according to Section 3.6 of the specification:
    Composite = 0.40 * Heart + 0.35 * Diabetes + 0.25 * Stroke
    """
    composite = (0.40 * heart_risk) + (0.35 * diabetes_risk) + (0.25 * stroke_risk)
    return round(min(max(composite, 0.02), 0.98), 4)

def classify_risk_tier(score: float) -> str:
    """
    4-Tier Risk Classification (Section 3.6):
    - Critical (>= 0.80)
    - High (0.60 - 0.80)
    - Moderate (0.40 - 0.60)
    - Low (< 0.40)
    """
    if score >= 0.80:
        return "Critical"
    elif score >= 0.60:
        return "High"
    elif score >= 0.40:
        return "Moderate"
    else:
        return "Low"

def compute_confidence_interval(probability: float, n_samples: int = 120, confidence_level: float = 0.95) -> ConfidenceInterval:
    """
    Computes 95% confidence interval for prediction probability using binomial standard error:
    SE = sqrt(p * (1 - p) / n)
    Margin = 1.96 * SE
    """
    p = min(max(probability, 0.01), 0.99)
    se = math.sqrt((p * (1.0 - p)) / n_samples)
    z = 1.96 if confidence_level == 0.95 else 1.645
    margin = z * se
    
    lower = max(0.01, round(p - margin, 3))
    upper = min(0.99, round(p + margin, 3))
    
    return ConfidenceInterval(
        lower=lower,
        upper=upper,
        confidence_level=confidence_level
    )
