#!/bin/bash

# This script sets up the test database and runs the tests. It handles the following:
# - Starts the test database container
# - Sets the DATABASE_URL environment variable to the test database (overwrites local .env file)
# - Runs the tests using vitest
# - Cleans up the Docker test database container

set -e  # Exit on error

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CWD="$SCRIPT_DIR/.."  # backend directory
COMPOSE_FILE="$SCRIPT_DIR/../docker-compose.yml"

EXIT_CODE=0

# Function to wait for the Postgres test database container to be ready
wait_for_db() {
  local max_attempts=30
  local attempt=1
  
  echo "Waiting for database to be ready..."
  
  while [ $attempt -le $max_attempts ]; do
    if docker compose -f "$COMPOSE_FILE" exec -T db-test pg_isready -U lifter_test -d lifter_test > /dev/null 2>&1; then
      echo "Database is ready!"
      return 0
    fi
    
    echo "Attempt $attempt/$max_attempts: Database not ready yet..."
    sleep 1
    attempt=$((attempt + 1))
  done
  
  echo "ERROR: Postgres test container did not become ready in time"
  return 1
}

# Cleanup function to ensure database is stopped
cleanup() {
  echo "Cleaning up..."
  cd "$CWD"
  docker compose -f "$COMPOSE_FILE" down db-test 2>/dev/null || true
}

# Set trap to ensure cleanup happens on exit
trap cleanup EXIT

# Main execution
main() {
  cd "$CWD"
  
  echo "Starting test database container..."
  docker compose -f "$COMPOSE_FILE" up -d db-test
  
  # Wait until Postgres in the container is actually ready to accept connections
  if ! wait_for_db; then
    EXIT_CODE=1
    return 1
  fi
  
  # Set the DATABASE_URL for test database
  export DATABASE_URL="postgresql://lifter_test:lifter_test@localhost:5434/lifter_test"
  
  echo "Running migrations..."
  pnpm db:migrate
  
  echo "Running tests..."
  pnpm vitest run --dir ./src/lib/db/test
}

# Run main function and capture exit code
if main; then
  echo "Tests completed successfully!"
else
  EXIT_CODE=$?
  echo "Tests failed with exit code: $EXIT_CODE"
fi

exit $EXIT_CODE
