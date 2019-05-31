import { BaseError, Logger } from "../lib";

describe("lib.logger", () => {
  beforeEach(() => {
    (Logger as any).instance = undefined;
  });

  it("should throw if tried to be accessed without proper initialization", async () => {
    expect(() => Logger.getInstance()).toThrow(/initialized yet/gi);
  });

  it("ensure only first initialized is kept as singleton", async () => {
    expect(() => Logger.getInstance()).toThrow(/initialized yet/gi);
    Logger.initialize();
    (Logger as any).instance.flag = true;
    Logger.initialize();
    expect((Logger as any).instance.flag).toBe(true);
  });

  it("should throw if tried to be constructed", async () => {
    const SimpleLogger: any = Logger;
    expect(() => new SimpleLogger()).toThrow(/constructor is deprecated/gi);
  });

  it("should have instantiate a valid Logger using singleton", () => {
    const logger = Logger.initialize();
    expect(logger).toHaveProperty("silly");
    expect(logger).toHaveProperty("info");
    expect(logger).toHaveProperty("debug");
    expect(logger).toHaveProperty("warn");
    expect(logger).toHaveProperty("error");
    expect(Logger.getInstance()).toEqual(logger);

    logger.info("Sample test");
  });

  it("should send simple info object with message", () => {
    const logger = Logger.initialize();
    logger.info({ test: true });
  });

  it("should send simple info object with message", () => {
    const logger = Logger.initialize();
    logger.info("Sample test", { test: true });
  });

  it("should send simple error", () => {
    const logger = Logger.initialize();
    logger.error(new Error("Unit test error"));
  });

  it("should send simple base error", () => {
    const logger = Logger.initialize();
    logger.error(
      new BaseError("Unit test base error", {
        error: true
      })
    );
  });

  it("should send simple error with message", () => {
    const logger = Logger.initialize();
    logger.error("Sample base error", new Error("Unit test error"));
  });

  it("should send simple base error with message", () => {
    const logger = Logger.initialize();
    logger.error(
      "Sample base error",
      new BaseError("Unit test base error", {
        error: true
      })
    );
  });

  describe("some corner cases", async () => {
    it("should send simple info object with message", () => {
      Logger.initialize().info({ message: { test: true } });
    });

    it("should send simple error", () => {
      Logger.initialize().error({
        message: new Error("Unit test error")
      });
    });

    it("should send simple base error", () => {
      Logger.initialize().error({
        message: new BaseError("Unit test base error", {
          error: true
        })
      });
    });
  });
});
