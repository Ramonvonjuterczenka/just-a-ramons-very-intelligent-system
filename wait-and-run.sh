#!/bin/sh

OLLAMA_URL=${JARVIS_OLLAMA_URL:-http://ollama:11434}
JAR_CMD="java -jar /app/app.jar"

echo "Waiting for Ollama at ${OLLAMA_URL}..."

MAX_RETRIES=30
SLEEP_SEC=2
count=0
while [ $count -lt $MAX_RETRIES ]; do
  # check /api/tags as a lightweight health check
  status_code=$(curl -s -o /dev/null -w "%{http_code}" ${OLLAMA_URL}/api/tags || true)
  if [ "$status_code" = "200" ]; then
    echo "Ollama is available at ${OLLAMA_URL}. Starting Jarvis."
    exec sh -c "$JAR_CMD"
  fi
  count=$((count+1))
  echo "Ollama not ready yet (attempt ${count}/${MAX_RETRIES}), status=${status_code}. Retrying in ${SLEEP_SEC}s..."
  sleep ${SLEEP_SEC}
done

echo "Ollama did not become ready within timeout. Starting Jarvis anyway."
exec sh -c "$JAR_CMD"

