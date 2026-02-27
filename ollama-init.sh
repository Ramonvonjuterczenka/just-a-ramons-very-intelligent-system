#!/bin/sh

# This script runs inside the ollama container and ensures a good default LLM model is available
# It's called as the entrypoint before the main ollama server starts

echo "=========================================="
echo "  JARVIS Ollama Initialization"
echo "=========================================="

# Start ollama in the background
ollama serve &
OLLAMA_PID=$!

# Wait a bit for ollama to be ready
sleep 5

# Default model to pull
DEFAULT_MODEL="${OLLAMA_DEFAULT_MODEL:-mistral}"

echo ""
echo "Pulling default model: $DEFAULT_MODEL"
echo "(This may take a few minutes on first run...)"
echo ""

# Pull the default model
ollama pull "$DEFAULT_MODEL"

if [ $? -eq 0 ]; then
  echo ""
  echo "✓ Model '$DEFAULT_MODEL' is ready"
  echo "  Available at: http://ollama:11434"
  echo ""
else
  echo ""
  echo "⚠ Failed to pull $DEFAULT_MODEL, but Ollama will still start."
  echo "  You can manually pull a model using:"
  echo "  docker exec jarvis-ollama ollama pull <model-name>"
  echo ""
fi

# Wait for the background process
wait $OLLAMA_PID

