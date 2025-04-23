import minimist from 'minimist'
import prompts from 'prompts'
import { red, dim } from 'kolorist'
import { gradientText } from './utils/banner.js'
import { texts, colors } from './config.js'
import shell from 'shelljs'

export interface ProjectOptions {
    projectName: string
    useSupabase: boolean
}

export async function parseArguments(): Promise<ProjectOptions> {
    console.log()
    console.log(gradientText('Vibe code CLI', colors.greenPurpleGradient))
    console.log(dim('use --help for more info'))
    console.log()

    // parse args
    const args = minimist(process.argv.slice(2))

    // --help flag
    if (args.help) {
        console.log(texts.help)
        shell.exit(0)
    }

    // default values
    let projectName = 'cool-new-project'
    let projectType: string = 'app'
    let useSupabase = false

    // prompts
    await prompts(
        [
            {
                name: 'projectName',
                type: 'text',
                message: 'Project name:',
                initial: projectName,
                onState: (state) => {
                    projectName = state.value
                    return projectName
                },
            },
            {
                name: 'useSupabase',
                type: 'confirm',
                message: 'Do you want to use Supabase?',
                initial: false,
                onState: (state) => {
                    useSupabase = state.value
                    return useSupabase
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

    return {
        projectName,
        useSupabase
    }
} 