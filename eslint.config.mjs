import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: ["test-results/**", "playwright-report/**", ".next/**"],
  },
  ...nextVitals,
];

export default config;
