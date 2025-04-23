import prompts from 'prompts'
import { red, inverse } from 'kolorist'
import path from 'path'
import { Ora } from 'ora'
import execAsync from '../utils/execAsync.js'
import fs from 'fs/promises'

export async function setupSupabase(projectName: string, useSupabase: boolean,loader: Ora) {
    if (!useSupabase) return

    // loader.start('Configuring Supabase...')
    console.log(inverse('First, create a supabase project at https://supabase.com/dashboard/projects'))
    // These are the environment variables we need to set up
    const supabaseEnvVars = {
        SUPABASE_ACCESS_TOKEN: '',
        SUPABASE_URL: '',
        SUPABASE_DB_PASSWORD: '',
        SUPABASE_PROJECT_ID: '',
        SUPABASE_ANON_KEY: '',
        SUPABASE_SERVICE_ROLE_KEY: ''
    }

    await prompts(
        [
            {
                name: 'accessToken',
                type: 'text',
                message: 'Supabase Access Token:',
                initial: '',
                onState: (state) => {
                    supabaseEnvVars.SUPABASE_ACCESS_TOKEN = state.value
                    return state.value
                },
            },
            {
                name: 'url',
                type: 'text',
                message: 'Supabase URL:',
                initial: '',
                onState: (state) => {
                    supabaseEnvVars.SUPABASE_URL = state.value
                    return state.value
                },
            },
            {
                name: 'dbPassword',
                type: 'password',
                message: 'Supabase DB Password:',
                initial: '',
                onState: (state) => {
                    supabaseEnvVars.SUPABASE_DB_PASSWORD = state.value
                    return state.value
                },
            },
            {
                name: 'projectId',
                type: 'text',
                message: 'Supabase Project ID:',
                initial: '',
                onState: (state) => {
                    supabaseEnvVars.SUPABASE_PROJECT_ID = state.value
                    return state.value
                },
            },
            {
                name: 'anonKey',
                type: 'text',
                message: 'Supabase Anon Key:',
                initial: '',
                onState: (state) => {
                    supabaseEnvVars.SUPABASE_ANON_KEY = state.value
                    return state.value
                },
            },
            {
                name: 'serviceRoleKey',
                type: 'text',
                message: 'Supabase Service Role Key:',
                initial: '',
                onState: (state) => {
                    supabaseEnvVars.SUPABASE_SERVICE_ROLE_KEY = state.value
                    return state.value
                },
            },
        ],
        {
            onCancel: () => {
                console.log(`${red('✖')} Operation cancelled`)
                process.exit(1)
            },
        },
    )

    // create the environment variables to the .env file overwrite if it exists
    const envFilePath = path.join(projectName, '.env')
    await fs.writeFile(envFilePath, Object.entries(supabaseEnvVars)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n'))

    await execAsync(`cd ${projectName} && npx -y supabase init`, { silent: true })
    // loader.start('Starting supabase (this may take a while)')
    // await execAsync(`cd ${projectName} && npx supabase start`, { silent: false })

    await execAsync(`cd ${projectName} && npx supabase link --project-ref ${supabaseEnvVars.SUPABASE_PROJECT_ID}`, { silent: true })
    console.log(inverse('Supabase configured, use `npx supabase start` to start supabase locally'))

    // loader.succeed('Supabase configured')
}