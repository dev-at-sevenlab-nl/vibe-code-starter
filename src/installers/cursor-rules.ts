import ora, { Ora } from 'ora'
import execAsync from '../utils/execAsync.js'

export async function installCursorRules(projectName: string, loader: Ora) {
    loader.start('Adding Cursor rules for AI...')
    const rules = [
        { name: 'global', id: '7115f0ac3f2a1d9c2e95a9e73d1996d9' },
        { name: 'vue', id: '246f3e9dd738b734c8cbaeade362b93c' },
        { name: 'ts', id: '6f8ce23f2d569b7cde3ad71a6ce0c1e7' },
        { name: 'vitest', id: 'fb423413e9b683b4a21ca843de2cb1d0' },
        { name: 'supabase-edge-functions', id: '573df9604e3f7ef3d175dba01a087f95' },
        { name: 'supabase-rls-policies', id: '53e69f965ede9d6ebf793e1f466a9045' },
        { name: 'supabase-db-functions', id: 'd003404654f91781047a8a8a17f51257' },
        { name: 'supabase-migrations', id: '120e05be8f722458cdd94d5ac29f3e1e' },
        { name: 'supabase-sql', id: '5068301d631270f60e9f9e5c2a9361e9' },
    ]
    for (const rule of rules) {
        await execAsync(
            `cd ${projectName} && curl --create-dirs -s -o ./.cursor/rules/${rule.name}.mdc https://gist.githubusercontent.com/dev-at-sevenlab-nl/${rule.id}/raw`
        )
    }
    loader.succeed('Cursor rules added')
} 