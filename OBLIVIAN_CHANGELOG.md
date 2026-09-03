# Oblivian change log and initial instructions

This branch (rename/oblivian) contains scaffolding added to:

- Provide a Linux-friendly Docker-based runtime (Dockerfile / docker-compose.yml).
- Provide a Meilisearch-based Oblivian Search scaffold under /search.
- Add a diagnostics page (diagnostics.html) to help triage game loading failures.
- Add scripts/rebrand.sh to perform in-repo search-and-replace for the `CineOS` -> `Oblivian` rebrand. Run it from the repo root while on this branch and review changes before committing.

Suggested next steps (what I'll do next):
1. Run the rebrand script and open a PR with the changes.
2. Try loading the site in the Docker container and test games via diagnostics.html.
3. Iterate on per-game fixes (CORS, missing assets, path fixes, polyfills).

To run locally (quick):

  # serve static files
  scripts/serve.sh 8000

  # or with Docker Compose (recommended when you want search):
  docker-compose up --build

