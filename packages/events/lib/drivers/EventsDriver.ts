import { BaseComponent, Component } from '@nano/app';
import { EventEmitter } from 'events';

export type Listener = (...args: any[]) => void;

export interface EventDriver<EventType = string> extends Component {
  name: string;
  on(eventType: EventType, listener: Listener): void;
  emit<Data = any>(eventType: EventType, data?: Data): Promise<boolean>;
}

export class MemoryDriver<EventType = string> extends BaseComponent implements EventDriver<EventType> {
  public readonly name: string = 'memory';

  public readonly handler = new EventEmitter();

  public on(eventType: EventType, listener: Listener): void {
    this.handler.on(typeof eventType === 'string' ? eventType : eventType.toString(), listener);
  }

  public async emit<Data = any>(eventType: EventType, data?: Data): Promise<boolean> {
    return this.handler.emit(typeof eventType === 'string' ? eventType : eventType.toString(), data);
  }
}
