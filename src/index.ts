#!/usr/bin/env node

import ora from 'ora'
import shell from 'shelljs'
import { gradientText } from './utils/banner.js'
import { colors } from './config.js'
import { parseArguments } from './cli.js'
import { createVueProject } from './installers/vue.js'
import { installTailwind } from './installers/tailwind.js'
import { installPrimeVue } from './installers/primevue.js'
import { installFontAwesome } from './installers/fontawesome.js'
import { installCursorRules } from './installers/cursor-rules.js'
import { configurePrettier } from './installers/prettier.js'
import { configureEslint } from './installers/eslint.js'
import { setupSupabase } from './installers/supabase.js'

// init loader
const loader = ora({
    color: 'green',
    spinner: {
        interval: 50,
        // prettier-ignore
        frames: ['▱▱▱▱▱▱▱', '▰▱▱▱▱▱▱', '▰▰▱▱▱▱▱', '▰▰▰▱▱▱▱', '▰▰▰▰▱▱▱', '▰▰▰▰▰▱▱', '▱▰▰▰▰▰▱', '▱▱▰▰▰▰▰', '▱▱▱▰▰▰▰', '▱▱▱▱▰▰▰', '▱▱▱▱▱▰▰', '▱▱▱▱▱▱▰', '▱▱▱▱▱▱▱', '▱▱▱▱▱▱▰', '▱▱▱▱▱▰▰', '▱▱▱▱▰▰▰', '▱▱▱▰▰▰▰', '▱▱▰▰▰▰▰', '▱▰▰▰▰▰▱', '▰▰▰▰▰▱▱', '▰▰▰▰▱▱▱', '▰▰▰▱▱▱▱', '▰▰▱▱▱▱▱', '▰▱▱▱▱▱▱'],
    },
})

;(async () => {
    try {
        // Parse arguments and get project options
        const options = await parseArguments()
        const { projectName, projectType, useSupabase } = options

        // Create Vue project
        await createVueProject(projectName)

        // Configure ESLint
        await configureEslint(projectName)

        // Configure Prettier
        await configurePrettier(projectName, loader)

        // Install Tailwind
        await installTailwind(projectName, loader)

        // Install PrimeVue if desktop project
        await installPrimeVue(projectName, projectType, loader)

        // Install FontAwesome
        await installFontAwesome(projectName, loader)

        // Install Cursor rules
        await installCursorRules(projectName, loader)

        // Setup Supabase if requested
        await setupSupabase(projectName, useSupabase)

        console.log()
        console.log(gradientText('Project created. Have fun', colors.greenGradient))
        console.log()

        shell.exit(0)
    } catch (error) {
        console.error('Error creating project:', error)
        shell.exit(1)
    }
})()
