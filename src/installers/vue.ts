import { spawn } from 'child_process'
import execAsync from '../utils/execAsync.js'
import fs from 'fs/promises'
import path from 'path'

export async function createVueProject(projectName: string) {
    console.log('\n🔨 Creating Vue Web app...')

    // Create a promise to handle the spawn process
    await new Promise<void>((resolve, reject) => {
        const createVue = spawn('npx', ['--yes', 'create-vue@latest', `${projectName}`], {
            stdio: 'inherit',
        })

        createVue.on('close', (code) => {
            if (code !== 0) {
                console.error(`Failed to create Vue web app (exit code: ${code})`)
                reject(new Error(`Process exited with code ${code}`))
            } else {
                console.log('\n✔ Vue web app created successfully!')
                resolve()
            }
        })
    }).catch((error) => {
        console.error(error)
        process.exit(1)
    })

    // Create .nvmrc file
    await execAsync(`echo "lts/*" > ./${projectName}/.nvmrc`)

    // add project requirement document
    await execAsync(`cd ${projectName} && curl -s https://gist.githubusercontent.com/dev-at-sevenlab-nl/4a172be538be0674380f97ff1d5782a3/raw/prd.md -o ./prd.md`)

    // add project tasks document
    await execAsync(`cd ${projectName} && curl -s https://gist.githubusercontent.com/dev-at-sevenlab-nl/a8163b1accf95c20a5fcb0f228432616/raw/tasks.md -o ./tasks.md`)

    // add starter promt markdown
    await execAsync(`cd ${projectName} && curl -s https://gist.githubusercontent.com/dev-at-sevenlab-nl/be7083f1b60779f1edcd7ccddbf4e2ce/raw/start.md -o ./start.md`)
    
    // Update README to add Cursor instructions
    const readmePath = path.join(projectName, 'README.md')
    let readmeFile = await fs.readFile(readmePath, 'utf8')
    const lines = readmeFile.split('\n')
    if (lines[0].startsWith('# ')) {
        lines.splice(1, 0, '## Put `@start.md` in cursor window and press `enter`')
    }
    await fs.writeFile(readmePath, lines.join('\n'), 'utf8')
} 