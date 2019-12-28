import { Logger } from '@nano/errors';
import { NanoEvents } from '../lib';

describe('lib.events.NanoEvents', () => {
  Logger.initialize();

  it('should reject unknown driver', async () => {
    expect(() => new NanoEvents({ driver: 'abc' as any })).toThrow(/unknown event driver/gi);
  });

  it('should subscribe to a simple event, then receive its broadcasts', async () => {
    let passed = false;
    const broadcast = new NanoEvents();

    await broadcast.onInit(null);

    const listener = (...args: any) => {
      expect(args[0] && args[0].value).toBe(123);
      passed = true;
    };

    broadcast.on('test', listener);
    await broadcast.emit('test', { value: 123 });
    expect(passed).toBe(true);
  });
});
