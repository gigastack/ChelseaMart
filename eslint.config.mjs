import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [
      "test-results/**",
      "playwright-report/**",
      ".next/**",
      ".worktrees/**",
      "node_modules/**",
      "*.log",
    ],
  },
  ...nextVitals,
];

export default config;
