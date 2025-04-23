import path from 'path'
import fs from 'fs/promises'
import ora, { Ora } from 'ora'

export async function configureEslint(projectName: string, hasEslint: boolean, loader: Ora) {
    // If ESLint wasn't selected during project creation, do nothing
    if (!hasEslint) {
        loader.info('ESLint not selected during Vue setup - skipping configuration')
        return
    }

    loader.start('Configuring ESLint...')
    const configPath = path.join(projectName, 'eslint.config.ts')
    const oldConfigPath = path.join(projectName, '.eslintrc.js')
    
    // Check which ESLint config file exists
    let eslintConfigFile: string
    let configFilePath: string
    
    if (await fileExists(configPath)) {
        eslintConfigFile = await fs.readFile(configPath, 'utf8')
        configFilePath = configPath
    } else if (await fileExists(path.join(projectName, 'eslint.config.js'))) {
        eslintConfigFile = await fs.readFile(path.join(projectName, 'eslint.config.js'), 'utf8')
        configFilePath = path.join(projectName, 'eslint.config.js')
    } else if (await fileExists(oldConfigPath)) {
        // For older ESLint config format
        eslintConfigFile = await fs.readFile(oldConfigPath, 'utf8')
        configFilePath = oldConfigPath
        
        // Update the old config format if needed
        if (eslintConfigFile.includes('rules:')) {
            eslintConfigFile = eslintConfigFile.replace(/rules:\s*{/, 
                `rules: {
    'no-unused-vars': 'off',`)
            await fs.writeFile(configFilePath, eslintConfigFile, 'utf8')
            loader.succeed('ESLint configured (legacy format)')
            return
        }
    } else {
        loader.warn('No ESLint configuration file found, skipping ESLint configuration')
        return
    }

    // For modern ESLint config format
    if (configFilePath.endsWith('.ts') || configFilePath.endsWith('.js')) {
        if (eslintConfigFile.includes('globalIgnores(')) {
            eslintConfigFile = eslintConfigFile.replace(
                /globalIgnores\(\[.*?\]\)/s,
                `globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'tailwind.config.js'])`
            )
        } else if (!eslintConfigFile.includes('globalIgnores([')) {
            eslintConfigFile = `globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'tailwind.config.js']),\n` + eslintConfigFile
        }
        
        await fs.writeFile(configFilePath, eslintConfigFile, 'utf8')
    }
    
    loader.succeed('ESLint configured')
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