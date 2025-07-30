import { spawn } from 'child_process'

export default function open(target: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let command = ''
    let args: string[] = []

    if (process.platform === 'darwin') {
      command = 'open'
      args = [target]
    } else if (process.platform === 'win32') {
      command = 'cmd'
      args = ['/c', 'start', '', target]
    } else {
      command = 'xdg-open'
      args = [target]
    }

    const child = spawn(command, args, { stdio: 'ignore', detached: true })
    child.on('error', reject)
    child.unref()
    resolve()
  })
}

