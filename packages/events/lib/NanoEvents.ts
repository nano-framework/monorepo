import { BaseComponentGroup, ComponentOptions } from '@nano/app';
import { EventDriver, Listener, MemoryDriver } from './drivers';
import { UnknownDriverError } from './errors';

export interface NanoEventsOptions<EventType = string> extends ComponentOptions {
  driver?: EventDriver<EventType>;
}

export class NanoEvents<EventType = string> extends BaseComponentGroup {
  public readonly options: NanoEventsOptions<EventType>;

  public readonly driver: EventDriver<EventType>;

  public constructor({ driver = new MemoryDriver(), ...options }: NanoEventsOptions<EventType> = {}) {
    if (driver && (!driver.on || !driver.emit)) {
      throw new UnknownDriverError(driver.name || driver.constructor.name);
    }

    super({ ...options, children: [driver] });
    this.driver = driver;
  }

  /**
   * Subscribe to new events of the supplied type.
   *
   * @param eventType The event type for the subscription
   * @param listener The listener for new events in this subscription
   */
  public on(eventType: EventType, listener: Listener): void {
    this.driver.on(eventType, listener);
  }

  /**
   * Publishes a new event of the supplied type. Optionally, attach some data for the subscription processing.
   *
   * @param eventType The event type for the subscription
   * @param data The data associated with this event
   */
  public async emit<Data = any>(eventType: EventType, data?: Data): Promise<boolean> {
    return this.driver.emit(eventType, data);
  }
}
