import { capitalize, getInitial } from "./string";

describe("capitalize", () => {
  it("should capitalize value", () => {
    expect(capitalize("owner")).toBe("Owner");
  });

  it("should handle uppercase values", () => {
    expect(capitalize("OWNER")).toBe("Owner");
  });

  it("should return empty strings unchanged", () => {
    expect(capitalize("")).toBe("");
  });
});

describe("getInitial", () => {
  it("should return the first letter of a single name in uppercase", () => {
    expect(getInitial("alice")).toBe("A");
  });

  it("should return the first letter of the first part of a full name", () => {
    expect(getInitial("john doe")).toBe("J");
  });

  it("should handle multiple spaces between names", () => {
    expect(getInitial("john  doe")).toBe("J");
  });

  it("should return ? for an empty string", () => {
    expect(getInitial("")).toBe("?");
  });

  it("should support unicode characters", () => {
    expect(getInitial("éclair")).toBe("É");
  });
});
