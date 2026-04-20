type ResolveEffectiveMoqInput = {
  defaultMoq: number;
  moqOverride: number | null;
};

function assertPositiveInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} MOQ must be a positive integer.`);
  }

  return value;
}

export function resolveEffectiveMoq(input: ResolveEffectiveMoqInput) {
  const defaultMoq = assertPositiveInteger(input.defaultMoq, "Default");

  if (input.moqOverride === null) {
    return defaultMoq;
  }

  return assertPositiveInteger(input.moqOverride, "Product override");
}
