import { BaseError } from "../lib";
import * as MockCleanStack from "../__mocks__/clean-stack";

describe("lib.error.BaseError", () => {
  it("should instantiate a BaseError properly", () => {
    const error = new BaseError("Test");

    expect(error.message).toMatch(/Test/);
    expect(error.message).toMatch(new RegExp(error.stackId));

    const jsonObj = error.toJSON();
    expect(typeof jsonObj).toBe(typeof {});

    const jsonStr = error.toJSON(true);
    expect(typeof jsonStr).toBe(typeof "string");
  });

  describe("without captureStackTrace", () => {
    let captureStackTrace;

    beforeEach(async () => {
      captureStackTrace = Error.captureStackTrace;
      Error.captureStackTrace = null;
    });

    afterEach(async () => {
      Error.captureStackTrace = captureStackTrace;
      captureStackTrace = null;
    });

    it("should instantiate properly without captureStackTrace", () => {
      const error = new BaseError("Test", { test: true });

      expect(error).toHaveProperty("stack");
      expect(error).toHaveProperty("details", { test: true });
      expect(error.toObject()).toHaveProperty("details", { test: true });

      const jsonObj = error.toJSON();
      expect(typeof jsonObj).toBe(typeof {});

      const jsonStr = error.toJSON(true);
      expect(typeof jsonStr).toBe(typeof "string");
    });
  });

  it("should instantiate properly with a function as input", () => {
    const error = new BaseError(() => "blah");
    expect(error.message.split("() => blah")).toHaveLength(1);
  });

  it("should instantiate properly with a undefined as input", () => {
    const error = new BaseError();
    expect(error.message.split(" undefined ")).toHaveLength(1);
  });

  it("should instantiate properly with an inherit stack trace", () => {
    const originalError = new Error("Test with inherit stack");
    const baseError = new BaseError(originalError);

    const originalStack = originalError.stack.toString();
    const baseStack = baseError.stack.toString();

    expect(originalStack.split(baseStack)).toHaveLength(1);
  });

  describe("with failing clean-stack", () => {
    beforeAll(() => MockCleanStack.fail(true));
    afterAll(() => MockCleanStack.fail(false));

    it("should instantiate properly with a failing clean-stack dependency", () => {
      const error = new BaseError("Test", { test: true });

      expect(error).toHaveProperty("stack");
      expect(error).toHaveProperty("details", { test: true });
      expect(error.toObject()).toHaveProperty("details", { test: true });

      const jsonObj = error.toJSON();
      expect(typeof jsonObj).toBe(typeof {});

      const jsonStr = error.toJSON(true);
      expect(typeof jsonStr).toBe(typeof "string");
    });
  });
});
