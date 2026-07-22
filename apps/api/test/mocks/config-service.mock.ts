export function createConfigServiceMock(values: Record<string, unknown>) {
  return {
    get: jest.fn((key) => values[key]),
    getOrThrow: jest.fn((key) => {
      const value = values[key];

      if (value === undefined || value === null) {
        throw new Error(`TypeError: Configuration key "${key}" does not exist`);
      }

      return value;
    }),
  };
}

export type ConfigServiceMock = ReturnType<typeof createConfigServiceMock>;
