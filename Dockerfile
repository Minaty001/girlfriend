# ────────────────────────────────────────────────────────────────
# Luna v3 — Dockerfile
# Python 3.13-slim, production-ready single-stage build
# ────────────────────────────────────────────────────────────────

FROM python:3.13-slim

WORKDIR /app

# Install system dependencies (minimal)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files
COPY brain.py app.py ./
COPY style.css script.js index.html ./

# Create a non-root user and switch to it
RUN addgroup --system app && adduser --system --group app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python3 -c "import urllib.request; print(urllib.request.urlopen('http://127.0.0.1:8000/health').read().decode())" || exit 1

# Run
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
