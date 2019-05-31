import { Application } from '../lib';
import { TimerComponent } from './components/TimerComponent';

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
  children = [new TimerComponent()]
}