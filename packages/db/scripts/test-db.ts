/**
 * This script sets up the test database and runs the tests. It handles the following:
 * - Starts the test database container
 * - Sets the DATABASE_URL environment variable to the test database (overwrites local .env file)
 * - Runs the tests using vitest
 * - Cleans up the Docker test database container
 */
import { execSync } from "node:child_process";
import process from "node:process";

function run(cmd: string, cwd: string, env?: NodeJS.ProcessEnv) {
  execSync(cmd, {
    stdio: "inherit",
    cwd,
    env,
  });
}

/**
 * Waits for the Postgres test database container to be ready to accept connections.
 * @param cwd - The current working directory
 * @returns void
 */
function waitForDb(cwd: string) {
  const maxAttempts = 30;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      run(
        "docker compose exec -T db-test pg_isready -U lifter_test -d lifter_test",
        cwd
      );
      return;
    } catch {
      execSync("sleep 1", { stdio: "inherit" });
    }
  }
  throw new Error("Postgres test container did not become ready in time");
}

async function main() {
  const cwd = __dirname + "/.."; // packages/db

  let exitCode = 0;

  try {
    run("docker compose up -d db-test", cwd);

    // Wait until Postgres in the container is actually ready to accept connections
    waitForDb(cwd);

    const env = {
      ...process.env,
      DATABASE_URL:
        "postgresql://lifter_test:lifter_test@localhost:5434/lifter_test",
    };

    run("pnpm migrate", cwd, env);

    run("pnpm vitest run", cwd, env);
  } catch (error: any) {
    exitCode = typeof error?.status === "number" ? error.status : 1;
  } finally {
    try {
      run("docker compose down db-test", cwd);
    } catch {}

    process.exit(exitCode);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
