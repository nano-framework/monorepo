import { Application } from '../lib';
import { ExampleApplication } from '../examples/simple';

jest.useFakeTimers();

class TestApplication extends ExampleApplication {
}

describe('Application', () => {
  it('should initialize a simple application', async () => {
    const app = new TestApplication();
    
    await app.start();
    jest.runOnlyPendingTimers();
    await app.stop();
  });

});
