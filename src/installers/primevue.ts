import ora, { Ora } from 'ora'
import path from 'path'
import fs from 'fs/promises'
import execAsync from '../utils/execAsync.js'
import { fetchJson } from '../utils/fetchJson.js'

export async function installPrimeVue(projectName: string, loader: Ora) {
    loader.start('Adding Primevue...')
    await execAsync(`cd ${projectName} && npm install primevue && npm i tailwindcss-primeui`, { silent: true })
    
    // Check for main.ts or main.js depending on TypeScript usage
    const mainTsPath = path.join(projectName, 'src', 'main.ts')
    const mainJsPath = path.join(projectName, 'src', 'main.js')
    
    // Determine which main file to use
    let mainPath: string
    if (await fileExists(mainTsPath)) {
        mainPath = mainTsPath
    } else if (await fileExists(mainJsPath)) {
        mainPath = mainJsPath
    } else {
        throw new Error('Could not find main.ts or main.js file')
    }
    
    let mainFile = await fs.readFile(mainPath, 'utf8')
    // Add PrimeVue import
    mainFile = mainFile.replace(
        /import { createApp } from 'vue'/,
        `import { createApp } from 'vue'\nimport PrimeVue from 'primevue/config';`
    )
    // Add PrimeVue usage
    mainFile = mainFile.replace(
        /const app = createApp.*?\)/,
        `const app = createApp(App)\napp.use(PrimeVue, { theme: 'none' })`
    )
    await fs.writeFile(mainPath, mainFile, 'utf8')
    
    const releases = await fetchJson('https://api.github.com/repos/primefaces/primevue-tailwind/releases')
    const primevueUrl = releases[0]?.assets?.[0]?.browser_download_url
    if (!primevueUrl) throw new Error('❌ Failed to fetch PrimeVue asset URL')
    const fileName = primevueUrl.split('/').pop()
    const filePath = path.join(projectName, fileName!)
    // Download the zip file
    const fileBuffer = await fetch(primevueUrl).then(res => res.arrayBuffer())
    await fs.writeFile(filePath, Buffer.from(fileBuffer))
    // Unzip and then delete the zip
    await execAsync(`unzip ${fileName} -d ./src/assets/`, { cwd: projectName, silent: true })
    await fs.unlink(filePath) // clean up zip
    
    // npm install -D postcss-import
    await execAsync(`cd ${projectName} && npm install -D postcss-import`, { silent: true })

    // Modify postcss.config.js to add 'postcss-import': {},
    await execAsync(
        `cd ${projectName} && node -e "const fs = require('fs'); const filePath = './postcss.config.js'; let data = fs.readFileSync(filePath, 'utf8'); data = data.replace(/plugins: \\{/, 'plugins: {\\n    \\'postcss-import\\': {},'); fs.writeFileSync(filePath, data, 'utf8');"`
    )

    // Modify CSS files to use our color scheme
    await execAsync(`cd ${projectName} && find src/assets/primevue -type f -name "*.css" -exec sed -i'' -e '/\.p-.*-secondary/,/^}/ s/surface-/secondary-/g' {} +`)
    await execAsync(`cd ${projectName} && find src/assets/primevue -type f -name "*.css" -exec sed -i'' -e '/\.p-.*-success/,/^}/ s/green-/success-/g' {} +`)
    await execAsync(`cd ${projectName} && find src/assets/primevue -type f -name "*.css" -exec sed -i'' -e '/\.p-.*-info/,/^}/ s/sky-/info-/g' {} +`)
    await execAsync(`cd ${projectName} && find src/assets/primevue -type f -name "*.css" -exec sed -i'' -e '/\.p-.*-warn/,/^}/ s/orange-/warning-/g' {} +`)
    await execAsync(`cd ${projectName} && find src/assets/primevue -type f -name "*.css" -exec sed -i'' -e '/\.p-.*-danger/,/^}/ s/red-/danger-/g' {} +`)

    // Modify base.css to use primevue variable
    await execAsync(
        `cd ${projectName} && curl -s https://gist.githubusercontent.com/dev-at-sevenlab-nl/64954bee61b0ec6e0a7ceec6ffeec3e1/raw/base.css -o ./src/assets/base.css`
    )
    loader.succeed('Primevue added')
}

// Helper function to check if a file exists
async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath)
        return true
    } catch {
        return false
    }
} 