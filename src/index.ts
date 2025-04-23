#!/usr/bin/env node

import ora from 'ora'
import shell from 'shelljs'
import { gradientText } from './utils/banner.js'
import { colors } from './config.js'
import { parseArguments } from './cli.js'
import { createVueProject, VueProjectOptions } from './installers/vue.js'
import { installTailwind } from './installers/tailwind.js'
import { installPrimeVue } from './installers/primevue.js'
import { installFontAwesome } from './installers/fontawesome.js'
import { installCursorRules } from './installers/cursor-rules.js'
import { configurePrettier } from './installers/prettier.js'
import { configureEslint } from './installers/eslint.js'
import { setupSupabase } from './installers/supabase.js'
import { checkNodeVersion } from './utils/version-check.js'

// Check Node.js version (requires v20 or higher as specified in package.json)
if (!checkNodeVersion(20)) {
    process.exit(1)
}

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
        const { projectName, useSupabase } = options

        // Create Vue project and get selected features
        const vueOptions: VueProjectOptions = await createVueProject(projectName)
        
        // Log detected Vue project options
        loader.info(`Detected Vue project configuration:`)
        loader.info(`- TypeScript: ${vueOptions.hasTypeScript ? 'Yes' : 'No'}`)
        loader.info(`- ESLint: ${vueOptions.hasEslint ? 'Yes' : 'No'}`)
        loader.info(`- Prettier: ${vueOptions.hasPrettier ? 'Yes' : 'No'}`)

        // Configure ESLint if selected
        await configureEslint(projectName, vueOptions.hasEslint, loader)

        // Configure Prettier if selected
        await configurePrettier(projectName, vueOptions.hasPrettier, loader)

        // Install Tailwind
        await installTailwind(projectName, loader)

        // Install PrimeVue
        await installPrimeVue(projectName, loader)

        // Install FontAwesome
        await installFontAwesome(projectName, loader)

        // Install Cursor rules
        await installCursorRules(projectName, loader)

        // Setup Supabase if requested
        await setupSupabase(projectName, useSupabase, loader)

        console.log()
        console.log(gradientText('Project created. Have fun', colors.greenGradient))
        console.log()

        shell.exit(0)
    } catch (error) {
        console.error('Error creating project:', error)
        shell.exit(1)
    }
})()
