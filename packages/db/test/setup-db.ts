import { execSync } from "node:child_process";

execSync("pnpm migrate", {
  stdio: "inherit",
  cwd: __dirname + "/..", // packages/db
});
