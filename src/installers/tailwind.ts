import ora, { Ora } from 'ora'
import path from 'path'
import fs from 'fs/promises'
import execAsync from '../utils/execAsync.js'

export async function installTailwind(projectName: string, loader: Ora) {
    loader.start('Adding Tailwind...')
    await execAsync(`cd ${projectName} && npm install -D tailwindcss@3 postcss autoprefixer`, { silent: true })
    await execAsync(`cd ${projectName} && npx tailwindcss init --postcss`, { silent: true })
    await execAsync(
        `cd ${projectName} && curl -s https://gist.githubusercontent.com/dev-at-sevenlab-nl/a99175c185c8c27a60ba21308be05d9a/raw/tailwind.config.js -O`
    )
    await execAsync(`echo "@tailwind base;\n@tailwind components;\n@tailwind utilities;" > ./${projectName}/src/assets/base.css`)
    loader.succeed('Tailwind added')
} 