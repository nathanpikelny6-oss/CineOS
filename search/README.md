Oblivian Search - scaffold

This directory contains a minimal scaffold and instructions to run a local Meilisearch instance and index example data so you can quickly try "Oblivian Search".

Run with Docker Compose (recommended):

  docker-compose up -d

This will start Meilisearch on port 7700. Use the Meilisearch admin UI or the HTTP API to create an index and add documents.

Example indexing (using curl):

  curl -X POST 'http://localhost:7700/indexes' -H 'Content-Type: application/json' --data '{"uid":"movies"}'
  curl -X POST 'http://localhost:7700/indexes/movies/documents' -H 'Content-Type: application/json' --data '[{"id":1,"title":"Example Movie","description":"An Oblivian demo movie."}]'

Search example:

  curl 'http://localhost:7700/indexes/movies/search' -H 'Content-Type: application/json' --data '{"q":"Example"}'

Integrate the search UI by calling the Meilisearch API from the client (see index.html / script.js integration suggestions in the root README).
