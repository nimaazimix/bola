import { getInitial } from "./utils";

describe("getInitial", () => {
  it("should return the first letter of a single name in uppercase", () => {
    expect(getInitial("alice")).toBe("A");
  });

  it("should return the first letter of the first word for full names", () => {
    expect(getInitial("john doe")).toBe("J");
  });

  it("should trim leading and trailing whitespace", () => {
    expect(getInitial(" alice ")).toBe("A");
  });

  it("should handle multiple spaces between words", () => {
    expect(getInitial("john  doe")).toBe("J");
  });

  it("should return ? for an empty string", () => {
    expect(getInitial("")).toBe("?");
  });

  it("should support unicode characters", () => {
    expect(getInitial("éclair")).toBe("É");
  });
});
