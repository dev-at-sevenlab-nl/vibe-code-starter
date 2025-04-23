import path from 'path'
import fs from 'fs/promises'

export async function configureEslint(projectName: string) {
    const configPath = path.join(projectName, 'eslint.config.ts')
    let eslintConfigFile = await fs.readFile(configPath, 'utf8')
    eslintConfigFile = eslintConfigFile.replace(
        /globalIgnores\(\[.*?\]\)/s,
        `globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'tailwind.config.js'])`
    )
    if (!eslintConfigFile.includes('globalIgnores([')) {
        eslintConfigFile = `globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'tailwind.config.js']),\n` + eslintConfigFile
    }
    await fs.writeFile(configPath, eslintConfigFile, 'utf8')
} 