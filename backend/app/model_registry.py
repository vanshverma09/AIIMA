from typing import List, Dict, Any, Optional
from .models_schema import ModelBenchmark

MODELS_REGISTRY_DATA: List[Dict[str, Any]] = [
    {
        "model_id": "rf-champion-v2.4",
        "model_name": "Random Forest Classifier",
        "category": "Machine Learning",
        "validation_accuracy": 92.4,
        "holdout_accuracy": 91.7,
        "precision": 91.8,
        "recall": 93.1,
        "f1_score": 92.4,
        "auc_roc": 0.967,
        "latency_ms": 12.4,
        "training_time_s": 14.8,
        "status": "Champion",
        "version": "v2.4-prod",
        "description": "Production Champion: 200-tree calibrated forest with Gini impurity splitting and bootstrap feature bagging."
    },
    {
        "model_id": "xgboost-candidate-v2.3",
        "model_name": "XGBoost Classifier",
        "category": "Machine Learning",
        "validation_accuracy": 92.1,
        "holdout_accuracy": 91.4,
        "precision": 91.6,
        "recall": 92.4,
        "f1_score": 92.0,
        "auc_roc": 0.963,
        "latency_ms": 14.1,
        "training_time_s": 22.5,
        "status": "Candidate",
        "version": "v2.3-candidate",
        "description": "Extreme gradient-boosted tree ensemble utilizing histogram-based splits and L2 regularization."
    },
    {
        "model_id": "gb-candidate-v2.1",
        "model_name": "Gradient Boosting (GBM)",
        "category": "Machine Learning",
        "validation_accuracy": 91.8,
        "holdout_accuracy": 91.0,
        "precision": 91.2,
        "recall": 91.9,
        "f1_score": 91.5,
        "auc_roc": 0.958,
        "latency_ms": 18.2,
        "training_time_s": 28.1,
        "status": "Candidate",
        "version": "v2.1-candidate",
        "description": "Sequential additive shrinkage tree ensemble optimized for log-loss minimization across clinical features."
    },
    {
        "model_id": "svm-rbf-v1.8",
        "model_name": "Support Vector Machine (RBF Kernel)",
        "category": "Machine Learning",
        "validation_accuracy": 88.6,
        "holdout_accuracy": 87.8,
        "precision": 87.9,
        "recall": 88.4,
        "f1_score": 88.1,
        "auc_roc": 0.932,
        "latency_ms": 22.6,
        "training_time_s": 35.4,
        "status": "Staging",
        "version": "v1.8-staging",
        "description": "Maximum-margin hyperplane with non-linear radial basis function kernel on standardized clinical space."
    },
    {
        "model_id": "logreg-baseline-v1.0",
        "model_name": "Logistic Regression (L2)",
        "category": "Baseline",
        "validation_accuracy": 84.2,
        "holdout_accuracy": 83.5,
        "precision": 83.1,
        "recall": 82.5,
        "f1_score": 82.8,
        "auc_roc": 0.891,
        "latency_ms": 4.1,
        "training_time_s": 2.1,
        "status": "Retired",
        "version": "v1.0-baseline",
        "description": "Standard clinical baseline: Regularized logit regression providing linear odds ratio interpretation."
    },
    {
        "model_id": "dtree-baseline-v1.0",
        "model_name": "Decision Tree (CART)",
        "category": "Baseline",
        "validation_accuracy": 81.5,
        "holdout_accuracy": 80.8,
        "precision": 80.2,
        "recall": 82.0,
        "f1_score": 81.1,
        "auc_roc": 0.843,
        "latency_ms": 3.2,
        "training_time_s": 1.5,
        "status": "Retired",
        "version": "v1.0-baseline",
        "description": "Single-tree partition model demonstrating transparent decision splits without ensemble averaging."
    }
]

# ROC curve generation points for frontend visualization
ROC_CURVES_DATA = {
    "Random Forest": [
        {"fpr": 0.00, "tpr": 0.00},
        {"fpr": 0.02, "tpr": 0.45},
        {"fpr": 0.05, "tpr": 0.78},
        {"fpr": 0.10, "tpr": 0.89},
        {"fpr": 0.15, "tpr": 0.94},
        {"fpr": 0.25, "tpr": 0.97},
        {"fpr": 0.40, "tpr": 0.985},
        {"fpr": 0.70, "tpr": 0.995},
        {"fpr": 1.00, "tpr": 1.00}
    ],
    "XGBoost": [
        {"fpr": 0.00, "tpr": 0.00},
        {"fpr": 0.03, "tpr": 0.42},
        {"fpr": 0.06, "tpr": 0.75},
        {"fpr": 0.12, "tpr": 0.88},
        {"fpr": 0.18, "tpr": 0.93},
        {"fpr": 0.30, "tpr": 0.96},
        {"fpr": 0.50, "tpr": 0.98},
        {"fpr": 1.00, "tpr": 1.00}
    ],
    "Gradient Boosting": [
        {"fpr": 0.00, "tpr": 0.00},
        {"fpr": 0.04, "tpr": 0.40},
        {"fpr": 0.08, "tpr": 0.73},
        {"fpr": 0.14, "tpr": 0.86},
        {"fpr": 0.22, "tpr": 0.92},
        {"fpr": 0.35, "tpr": 0.95},
        {"fpr": 1.00, "tpr": 1.00}
    ],
    "Logistic Regression": [
        {"fpr": 0.00, "tpr": 0.00},
        {"fpr": 0.08, "tpr": 0.35},
        {"fpr": 0.15, "tpr": 0.62},
        {"fpr": 0.25, "tpr": 0.78},
        {"fpr": 0.40, "tpr": 0.85},
        {"fpr": 0.60, "tpr": 0.91},
        {"fpr": 1.00, "tpr": 1.00}
    ]
}

def get_registered_models() -> List[ModelBenchmark]:
    return [ModelBenchmark(**m) for m in MODELS_REGISTRY_DATA]

def promote_model(model_id: str) -> Optional[ModelBenchmark]:
    target_idx = None
    for i, m in enumerate(MODELS_REGISTRY_DATA):
        if m["model_id"] == model_id:
            target_idx = i
            break
            
    if target_idx is None:
        return None
        
    for m in MODELS_REGISTRY_DATA:
        if m["status"] == "Champion":
            m["status"] = "Candidate"
            
    MODELS_REGISTRY_DATA[target_idx]["status"] = "Champion"
    return ModelBenchmark(**MODELS_REGISTRY_DATA[target_idx])

def get_champion_model() -> ModelBenchmark:
    for m in MODELS_REGISTRY_DATA:
        if m["status"] == "Champion":
            return ModelBenchmark(**m)
    return ModelBenchmark(**MODELS_REGISTRY_DATA[0])
