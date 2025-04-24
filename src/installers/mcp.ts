import { Ora } from 'ora'
import * as os from 'os'
import isWsl from 'is-wsl'
import path from 'path'
import fs from 'fs/promises'

export async function setupMCP(
    projectName: string,
    loader: Ora,
    supabaseAccessToken?: string,
): Promise<void> {
    loader.start('Setting up MCP configuration...')
    const platform = os.platform()
    const projectRoot = path.resolve(projectName)
    const cursorDir = path.join(projectRoot, '.cursor')
    const mcpConfigFile = path.join(cursorDir, 'mcp.json')

    let platformName: string
    if (isWsl) {
        platformName = 'WSL'
    } else if (platform === 'win32') {
        platformName = 'Windows'
    } else if (platform === 'darwin') {
        platformName = 'macOS'
    } else {
        platformName = platform
    }
    loader.info(`Detected platform: ${platformName}`)

    try {
        // Create .cursor directory if it doesn't exist
        if (!(await fs.stat(cursorDir)).isDirectory()) {
            await fs.mkdir(cursorDir, { recursive: true })
            loader.info(`Created directory: ${cursorDir}`)
        }

        // Define MCP configuration structure
        const mcpConfig: any = {
            mcpServers: {
                supabase: {
                    command: '',
                    args: [] as string[],
                },
            },
        }

        // Set command and args based on platform
        const supabaseArgs = [
            '-y',
            '@supabase/mcp-server-supabase@latest',
            '--access-token',
            supabaseAccessToken || '<personal-access-token>', // Use token or placeholder
        ]

        if (isWsl) {
            mcpConfig.mcpServers.supabase.command = 'wsl'
            mcpConfig.mcpServers.supabase.args = ['npx', ...supabaseArgs]
        } else if (platform === 'win32') {
            mcpConfig.mcpServers.supabase.command = 'cmd'
            mcpConfig.mcpServers.supabase.args = ['/c', 'npx', ...supabaseArgs]
        } else {
            // Default to macOS/Linux style
            mcpConfig.mcpServers.supabase.command = 'npx'
            mcpConfig.mcpServers.supabase.args = supabaseArgs
        }

        // Write the configuration to mcp.json
        await fs.writeFile(mcpConfigFile, JSON.stringify(mcpConfig, null, 2))

        loader.succeed(
            `MCP configuration created at ${mcpConfigFile}. ${!supabaseAccessToken ? "Please replace '<personal-access-token>' with your actual Supabase access token." : 'Using provided Supabase access token.'}`,
        )
    } catch (error) {
        loader.fail(`Failed to set up MCP configuration: ${error}`)
        // Optionally re-throw or handle the error further
    }
} 