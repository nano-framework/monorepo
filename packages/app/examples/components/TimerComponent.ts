import { BaseError, Logger } from '@nano/errors';
import { Application, Component } from "../../lib";

export class TimerComponent implements Component {
  logger = Logger.getInstance();

  // The initial options for the timer component
  options = {
    name: 'TimerComponent',
    startAt: 0,
    step: 1000,
  };

  /* The state variables for the timer */
  timer?: number = undefined;
  interval?: NodeJS.Timeout = undefined;

  /**
   * Mounts the timer once the 
   * 
   * @param app The application instance
   */
  public onMount(app: Application): void {
    this.start();
  }

  public async onInit() {

  }

  public async onReady() {

  }

  /* Runs once the application has been initialized */
  public onUnmount(app: Application): void {
    this.logger.debug(`${this.options.name} unmounting interval`);
    this.reset();
  }

  /** Steps the timer state */
  public reset() {
    this.logger.debug(`${this.options.name} resetting interval and timer value`);

    if (this.interval) {
      clearInterval(this.interval);
    }

    this.timer = undefined;
    this.interval = undefined;
  }

  /** Starts the timer component */
  public start() {
    this.logger.debug(`${this.options.name} starting interval steps`);
    this.timer = this.options.startAt;
    this.interval = setInterval(() => this.step(), this.options.step);
  }

  /** Steps the timer state */
  protected step() {
    this.timer += this.options.step;
    this.logger.info(`${this.options.name} component got a new step increment`, {
      timer: `${(this.timer / 1000).toFixed(3)}s`
    })
  }
}