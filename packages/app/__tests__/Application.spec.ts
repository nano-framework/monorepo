import { Application } from '../lib';
import { ExampleApplication } from '../examples/simple';

jest.useFakeTimers();

class TestApplication extends ExampleApplication {
}

describe('lib.app.Application', () => {
  it('should initialize a simple application without arguments', async () => {
    const app = new TestApplication();
    
    await app.start();
    jest.runOnlyPendingTimers();
    await app.stop();
  });

  it('should initialize a simple application with empty arguments', async () => {
    const app = new TestApplication({});
    
    await app.start();
    jest.runOnlyPendingTimers();
    await app.stop();
  });
});
