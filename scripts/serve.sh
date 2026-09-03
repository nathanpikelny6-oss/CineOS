#!/bin/sh
# scripts/serve.sh
# Simple local static server (Python) for quick testing
PORT=${1:-8000}

printf "Starting quick static server on http://localhost:${PORT}\n"
python3 -m http.server "$PORT"
