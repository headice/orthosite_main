"""Top-level entrypoint for running the FastAPI app.

This allows hosting providers that expect ``main:app`` at the repository root
(to run ``uvicorn main:app --host 0.0.0.0 --port 8000``) to load the actual
application defined in ``backend/main.py``.
"""

from backend.main import app  # re-export FastAPI instance for uvicorn

__all__ = ["app"]
