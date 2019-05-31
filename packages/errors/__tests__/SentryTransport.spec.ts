import { Logger, SentryTransport, BaseError } from "../lib";

describe("lib.logger.SentryTransport", () => {
  beforeEach(() => {
    (Logger as any).instance = undefined;
  });

  it("should throw if tried to be accessed without proper initialization", async () => {
    const logger = Logger.initialize({
      transports: [...Logger.DEFAULT_TRANSPORTS, new SentryTransport({})]
    });

    logger.info("Test sentry with jest");
    logger.error(new BaseError("Error test sentry with jest"));
  });
});
