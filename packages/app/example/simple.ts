import { Application } from '../lib';
import { DummyComponent, TimerComponent } from './components';

/**
 * A simple application with a Timer component.
 *
 * Usage:
 *
 *   ```
 *   const app new ExampleApplication();
 *   app.start().then(() => console.log('App started successfully'));
 *   ```
 */
export class ExampleApplication extends Application {
  public children = [
    // A dummy component for corner cases unit testing
    new DummyComponent(),

    // A sample timer component
    new TimerComponent(),
  ];
}
