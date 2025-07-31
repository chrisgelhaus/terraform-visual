import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);

const cliDir = process.cwd();

function runCli(planPath, outDir) {
  return execFileP('node', ['node_modules/ts-node/dist/bin.js', 'src/index.ts', '--plan', planPath, '--out', outDir], { cwd: cliDir });
}

test('cli generates report', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tfvisual-'));
  const planPath = path.join(tmpDir, 'plan.json');
  fs.writeFileSync(planPath, '{}');
  await runCli(planPath, tmpDir);
  const reportDir = path.join(tmpDir, 'terraform-visual-report');
  assert.ok(fs.existsSync(path.join(reportDir, 'index.html')));
  assert.ok(fs.existsSync(path.join(reportDir, 'plan.js')));
});
