import { Command } from 'commander'
import fs from 'fs-extra'
import path from 'path'
import open from './open'

const TEMPLATE_DIR = path.resolve(__dirname, '../template')
const TEMPLATE_DIST_PATH = path.resolve(TEMPLATE_DIR, 'dist')

interface InputOpts {
  out: string
  plan: string
}

async function main() {
  const callerPath = process.cwd()

  const program = new Command()

  program.option('--out <path>', 'set the output dir', callerPath)
  program.requiredOption('--plan <path>', 'set the relative path to Terraform plan')
  program.parse(process.argv)

  // Validate inputs
  const inputOpts = program.opts() as InputOpts
  const outDirPath = path.resolve(callerPath, inputOpts.out, 'terraform-visual-report')
  const planFilePath = path.resolve(callerPath, inputOpts.plan)

  try {
    await fs.access(planFilePath, fs.constants.R_OK)
  } catch (err) {
    console.error(`Cannot read plan file: ${planFilePath}`)
    process.exit(1)
  }

  console.log(`outDirPath:   ${outDirPath}`)
  console.log(`planFilePath: ${planFilePath}`)

  await fs.copy(TEMPLATE_DIST_PATH, outDirPath)

  const tfBuffer = await fs.readFile(planFilePath)
  const tfContent = tfBuffer.toString()
  await fs.writeFile(path.resolve(outDirPath, 'plan.js'), `window.TF_PLAN = ${tfContent}`)

  const indexFilePath = path.resolve(outDirPath, 'index.html')
  console.log('')
  console.log('\x1b[32m%s\x1b[0m', 'Report generated successfully!')
  try {
    await open(indexFilePath)
  } catch (err) {
    console.log('\x1b[33m%s\x1b[0m', `Failed to automatically open the report. Please open ${path.relative(callerPath, indexFilePath)} manually.`)
  }
}

try {
  main()
} catch (err) {
  console.log('Unhandled error', err)
}
