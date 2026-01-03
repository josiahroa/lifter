import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.e2e-test.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});
