import { BaseComponent } from '@nano/app';
import { exec, ExecException, spawn, SpawnOptions } from 'child_process';

export class CommandLineService extends BaseComponent {
  public async execute(command: string): Promise<{ stdout?: string; stderr?: string }> {
    return new Promise<{ stdout?: string; stderr?: string }>((ok, fail) => {
      exec(command, (error: ExecException, stdout: any, stderr: any) => {
        if (error) return fail(error);
        ok({ stdout, stderr });
      });
    });
  }

  public async spawn(
    cmd: string,
    args: string[],
    options: SpawnOptions,
  ): Promise<{ stdout?: string; stderr?: string; code?: number }> {
    const child = spawn(cmd, args, options);

    return new Promise<{ stdout?: string; stderr?: string; code?: number }>((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      let hasResolved = false;

      child.on('error', e => {
        if (!hasResolved) {
          hasResolved = true;
          reject(e);
        }
      });

      child.stdout.on('data', data => {
        stdout += data && data.length ? data.toString() : '';
      });

      child.stderr.on('data', data => {
        stderr += data && data.length ? data.toString() : '';
      });

      child.on('exit', code => {
        if (!hasResolved && code === 0) {
          resolve({ stdout, stderr, code });
        } else if (!hasResolved) {
          const e = new Error('Unknown spawn error');
          e.code = code;
          reject(e);
        }
      });
    });
  }
}
