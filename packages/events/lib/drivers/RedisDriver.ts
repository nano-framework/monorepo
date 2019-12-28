import { Application, BaseComponent, ComponentOptions } from '@nano/app';
import * as redis from 'redis';
import { promisify } from 'util';
import { EventDriver, Listener } from './EventsDriver';

export interface RedisDriverOptions extends ComponentOptions {
  client?: redis.RedisClient;
  clientOpts?: redis.ClientOpts;
}

export class RedisDriver<EventType = string> extends BaseComponent implements EventDriver<EventType> {
  public readonly name: string = 'memory';

  public readonly publisher: redis.RedisClient;

  public readonly subscriber: redis.RedisClient;

  public constructor(public options: RedisDriverOptions = {}) {
    super(options);
    this.publisher = options && options.client ? options.client : RedisDriver.initializeClient(options.clientOpts);
    this.subscriber = options && options.client ? options.client : RedisDriver.initializeClient(options.clientOpts);
  }

  public static initializeClient(opts: redis.ClientOpts) {
    return redis.createClient(opts || { url: 'redis://localhost:6379' });
  }

  public static async connectClient(client: redis.RedisClient): Promise<boolean> {
    if (client.connected) {
      return true;
    }
    return new Promise((resolve, reject) => {
      client.on('ready', () => resolve(true));
      client.on('error', error => reject(error));
    });
  }

  public serialize<Data = any>(data: Data): string {
    return JSON.stringify(data);
  }

  public unserialize<Data = any>(raw: string): Data {
    return JSON.parse(raw);
  }

  public async onInit(app: Application) {
    await super.onInit(app);

    if (!this.subscriber.connected || !this.publisher.connected) {
      await Promise.all([RedisDriver.connectClient(this.subscriber), RedisDriver.connectClient(this.publisher)]);
    }
  }

  public on(eventType: EventType, listener: Listener): void {
    const name = typeof eventType === 'string' ? eventType : eventType.toString();
    this.subscriber.on(name, (channel, message) => listener.bind(listener)({ channel, message }));
  }

  public async emit<Data = any>(eventType: EventType, data?: Data): Promise<boolean> {
    const name = typeof eventType === 'string' ? eventType : eventType.toString();
    const listeners = await promisify(this.publisher.publish).bind(this.publisher)(name, this.serialize(data));
    return listeners > 0;
  }
}
