import path from 'path'
import fs from 'fs/promises'
import ora, { Ora } from 'ora'

export async function configurePrettier(projectName: string, loader: Ora) {
    loader.start('Adding Prettier config...')
    const prettierConfig = {
        $schema: 'https://json.schemastore.org/prettierrc',
        tabWidth: 4,
        semi: false,
        singleQuote: true,
        singleLineFunctions: true,
        printWidth: 170,
    }
    const prettierPath = path.join(projectName, '.prettierrc.json')
    await fs.writeFile(prettierPath, JSON.stringify(prettierConfig, null, 4) + '\n')
    loader.succeed('Prettier config added')
} 