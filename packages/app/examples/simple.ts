import { Application } from '../lib';
import { TimerComponent } from './components/TimerComponent';

export class ExampleApplication extends Application {
  children = [
    new TimerComponent()
  ]
}

const app = new ExampleApplication();
app.start().then(() => console.log('App started successfully'));