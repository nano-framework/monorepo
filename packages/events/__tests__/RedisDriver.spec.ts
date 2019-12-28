import { Logger } from '@nano/errors';
import { NanoEvents, RedisDriver } from '../lib';

describe('lib.events.drivers.RedisDriver', () => {
  Logger.initialize();

  it('should subscribe to a simple event, then receive its broadcasts', async () => {
    let passed = false;
    const broadcast = new NanoEvents({
      driver: new RedisDriver({
        clientOpts: {
          url: 'redis://localhost:6379',
          enable_offline_queue: false,
        },
      }),
    });

    await broadcast.onInit(null);

    const listener = (...args: any) => {
      expect(args[0] && args[0].value).toBe(123);
      passed = true;
    };

    const pm = new Promise(resolve =>
      broadcast.on('test', (...args) => {
        passed = true;
        listener(...args);
        resolve();
      }),
    );

    await expect(broadcast.emit('test', { value: 123 })).resolves.toBe(true);

    await pm;
    expect(passed).toBe(true);
  });
});
