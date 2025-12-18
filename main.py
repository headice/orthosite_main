"""ASGI entrypoint for deployments running from the repository root.

This file simply re-exports the FastAPI ``app`` defined in ``backend/main.py``
so that commands like ``uvicorn main:app`` work even when the working directory
is the project root (where no ``main.py`` existed before).
"""

from backend.main import app

__all__ = ["app"]
