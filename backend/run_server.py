import uvicorn
import os
import sys

# Ensure backend directory is in python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(backend_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

if __name__ == "__main__":
    print("=" * 70)
    print("  HEALTHPREDICT AI — HEALTHCARE DATA ANALYTICS & RISK PREDICTION")
    print("  FastAPI Gateway running at: http://127.0.0.1:8000")
    print("  Swagger API Documentation:  http://127.0.0.1:8000/docs")
    print("=" * 70)
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=False)
