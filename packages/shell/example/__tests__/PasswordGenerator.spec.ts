import { join } from 'path';
import { CommandLineService } from '../../lib';

jest.setTimeout(15000);

describe('lib.shell.example.PasswordGenerator', () => {
  it('should generate help guide in command line', async () => {
    const cmd = new CommandLineService({});

    const { stdout, code } = await cmd.spawn('yarn', ['run', '-s', 'bin', '--help'], {
      cwd: join(__dirname, '../'),
      env: { ...process.env, LOG_LEVEL: 'info' },
    });

    expect(stdout).toMatch(/Usage: password-gen/gi);
    expect(code).toBe(0);
  });

  it('should generate password using math lib', async () => {
    const cmd = new CommandLineService({});

    const { stdout, code } = await cmd.spawn('yarn', ['run', '-s', 'bin', 'math', '-o', 'json', '-l', '12'], {
      cwd: join(__dirname, '../'),
      env: { ...process.env, LOG_LEVEL: 'info' },
    });

    const raw = JSON.parse(stdout);
    expect(raw).toHaveProperty('password');
    expect(raw.password).toHaveLength(12);
    expect(code).toBe(0);
  });
});
