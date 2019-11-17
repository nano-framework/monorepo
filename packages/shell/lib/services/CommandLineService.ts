import { BaseComponent } from '@nano/app';
import { exec, spawn, SpawnOptions } from 'child_process';

export class CommandLineService extends BaseComponent {
  public async execute(command: string): Promise<{ stdout?: string; stderr?: string }> {
    return new Promise<{ stdout?: string; stderr?: string }>((ok, fail) => {
      exec(command, (error: any, stdout: any, stderr: any) => {
        if (error) return fail(error);
        ok({ stdout, stderr });
      });
    });
  }

  public async spawn(cmd: string, args: string[], options: SpawnOptions): Promise<number> {
    const child = spawn(cmd, args, options);

    return new Promise<number>((resolve, reject) => {
      let error: Error;
      child.on('error', e => {
        this.logger.error(e);
        error = e;
      });

      child.on('exit', code => {
        if (code === 0) {
          resolve(code);
        } else {
          const result = error || { code };
          reject(result);
        }
      });
    });
  }
}
