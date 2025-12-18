"""Top-level entrypoint for running the FastAPI app without Docker.

Primary server process should target ``backend.main:app`` (see Procfile),
but this module re-exports :data:`app` from ``backend/main.py`` so that
platform launchers looking for ``main:app`` still succeed. Additionally, when
executed directly (``python main.py``) it will start Uvicorn itself. This
prevents the process from exiting immediately on hosts that simply run the
module instead of using the provided Procfile command.
"""

from __future__ import annotations

import os

import uvicorn

from backend.main import app  # re-export FastAPI instance for uvicorn

__all__ = ["app"]


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
    )
