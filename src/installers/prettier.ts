import path from 'path'
import fs from 'fs/promises'
import ora, { Ora } from 'ora'

export async function configurePrettier(projectName: string, hasPrettier: boolean, loader: Ora) {
    // If Prettier wasn't selected during project creation, do nothing
    if (!hasPrettier) {
        loader.info('Prettier not selected during Vue setup - skipping configuration')
        return
    }

    loader.start('Customizing Prettier config...')
    
    const prettierConfigPath = path.join(projectName, '.prettierrc.json')
    const prettierRcPath = path.join(projectName, '.prettierrc')
    
    // Determine which Prettier config file exists
    let configPath: string
    if (await fileExists(prettierConfigPath)) {
        configPath = prettierConfigPath
    } else if (await fileExists(prettierRcPath)) {
        configPath = prettierRcPath
    } else {
        loader.warn('No Prettier configuration file found, creating one')
        configPath = prettierConfigPath
    }
    
    const prettierConfig = {
        $schema: 'https://json.schemastore.org/prettierrc',
        tabWidth: 4,
        semi: false,
        singleQuote: true,
        singleLineFunctions: true,
        printWidth: 170,
    }
    
    await fs.writeFile(configPath, JSON.stringify(prettierConfig, null, 4) + '\n')
    loader.succeed('Prettier config customized')
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