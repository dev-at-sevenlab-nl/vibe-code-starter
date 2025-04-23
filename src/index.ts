#!/usr/bin/env node

import minimist from 'minimist'
import prompts from 'prompts'
import { red, dim } from 'kolorist'
import shell from 'shelljs'
import ora from 'ora'
import { spawn } from 'child_process'

import { gradientText } from './utils/banner.js'
import { texts, colors } from './config.js'
import execAsync from './utils/execAsync.js'
import fs from 'fs/promises'
import path from 'path'
import { fetchJson } from './utils/fetchJson.js'

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

    // variables
    let projectName = 'cool-new-project'
    let projectType: string = 'app'
    let useSupabase = false

    // propts
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

    console.log('\n🔨 Creating Vue Web app...')

    // Create a promise to handle the spawn process
    await new Promise<void>((resolve, reject) => {
        const createVue = spawn('npx', ['--yes', 'create-vue@latest', `${projectName}`], {
            stdio: 'inherit',
        })

        createVue.on('close', (code) => {
            if (code !== 0) {
                console.error(`Failed to create Vue web app (exit code: ${code})`)
                reject(new Error(`Process exited with code ${code}`))
            } else {
                console.log('\n✔ Vue web app created successfully!')
                resolve()
            }
        })
    }).catch((error) => {
        console.error(error)
        process.exit(1)
    })

    // Create .nvmrc file
    await execAsync(`echo "lts/*" > ./${projectName}/.nvmrc`)

    // add project requirement document
    await execAsync(`cd ${projectName} && curl -s https://gist.githubusercontent.com/dev-at-sevenlab-nl/4a172be538be0674380f97ff1d5782a3/raw/prd.md -o ./prd.md`)

    // add project tasks document
    await execAsync(`cd ${projectName} && curl -s https://gist.githubusercontent.com/dev-at-sevenlab-nl/a8163b1accf95c20a5fcb0f228432616/raw/tasks.md -o ./tasks.md`)

    // add starter promt markdown
    await execAsync(`cd ${projectName} && curl -s https://gist.githubusercontent.com/dev-at-sevenlab-nl/be7083f1b60779f1edcd7ccddbf4e2ce/raw/start.md -o ./start.md`)
    
    // add cursor rules
    loader.start('Adding Cursor rules for AI...');
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
    loader.succeed('Cursor rules added');

    // eslint eslint.config.ts
    // await execAsync(
    //     `cd ${projectName} && node -e "const fs = require('fs'); const filePath = './eslint.config.ts'; let data = fs.readFileSync(filePath, 'utf8'); data = data.replace(/ignores: .*?'\\]/, 'ignores: [\\'**/dist/**\\', \\'**/dist-ssr/**\\', \\'**/coverage/**\\', \\'tailwind.config.js\\']'); fs.writeFileSync(filePath, data, 'utf8');"`
    // )

    // eslint eslint.config.ts
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

    // prettier
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

    // tailwind
    loader.start('Adding Tailwind...')
    await execAsync(`cd ${projectName} && npm install -D tailwindcss@3 postcss autoprefixer`, { silent: true })
    await execAsync(`cd ${projectName} && npx tailwindcss init --postcss`, { silent: true })
    await execAsync(
        `cd ${projectName} && curl -s https://gist.githubusercontent.com/dev-at-sevenlab-nl/a99175c185c8c27a60ba21308be05d9a/raw/tailwind.config.js -O`
    );
    await execAsync(`echo "@tailwind base;\n@tailwind components;\n@tailwind utilities;" > ./${projectName}/src/assets/base.css`)
    loader.succeed('Tailwind added')

    // primevue
    if (projectType === 'desktop') {
        loader.start('Adding Primevue...')
        await execAsync(`cd ${projectName} && npm install primevue && npm i tailwindcss-primeui`, { silent: true })
        
        const mainPath = path.join(projectName, 'src', 'main.ts')
        let mainFile = await fs.readFile(mainPath, 'utf8')
        // Add PrimeVue import
        mainFile = mainFile.replace(
            /import { createApp } from 'vue'/,
            `import { createApp } from 'vue'\nimport PrimeVue from 'primevue/config';`
        )
        // Add PrimeVue usage
        mainFile = mainFile.replace(
            /const app = createApp.*?\)/,
            `const app = createApp(App)\napp.use(PrimeVue, { theme: 'none' })`
        )
        await fs.writeFile(mainPath, mainFile, 'utf8')
        await fs.writeFile(mainPath, mainFile, 'utf8')
        
        // Fetch and extract the URL for PrimeVue assets
        // const primevueUrl = await execAsync( // previous command, just in case
        //     'curl -s https://api.github.com/repos/primefaces/primevue-tailwind/releases | grep -m 1 \'"browser_download_url":\' | sed \'s/.*"browser_download_url": "\\(.*\\)".*/\\1/\''
        // ) as string;
        // const primevueUrl = await execAsync(`
        //     curl -s https://api.github.com/repos/primefaces/primevue-tailwind/releases | 
        //     grep -m 1 '"browser_download_url":' | 
        //     sed 's/.*"browser_download_url": "\\(.*\\)".*/\\1/'
        // `, { silent: true }) as string;
        // const name = primevueUrl.trim().split('/').pop()
        // await execAsync(`cd ${projectName} && curl -L -O "${primevueUrl.trim()}"`, { silent: true });
        // await execAsync(`cd ${projectName} && unzip ${name} -d ./src/assets/`, { silent: true });

        const releases = await fetchJson('https://api.github.com/repos/primefaces/primevue-tailwind/releases')
        const primevueUrl = releases[0]?.assets?.[0]?.browser_download_url
        if (!primevueUrl) throw new Error('❌ Failed to fetch PrimeVue asset URL')
        const fileName = primevueUrl.split('/').pop()
        const filePath = path.join(projectName, fileName!)
        // Download the zip file
        const fileBuffer = await fetch(primevueUrl).then(res => res.arrayBuffer())
        await fs.writeFile(filePath, Buffer.from(fileBuffer))
        // Unzip and then delete the zip
        await execAsync(`unzip ${fileName} -d ./src/assets/`, { cwd: projectName, silent: true })
        await fs.unlink(filePath) // clean up zip
        
        // npm install -D postcss-import
        await execAsync(`cd ${projectName} && npm install -D postcss-import`, { silent: true })

        // Modify postcss.config.js to add 'postcss-import': {},
        await execAsync(
            `cd ${projectName} && node -e "const fs = require('fs'); const filePath = './postcss.config.js'; let data = fs.readFileSync(filePath, 'utf8'); data = data.replace(/plugins: \\{/, 'plugins: {\\n    \\'postcss-import\\': {},'); fs.writeFileSync(filePath, data, 'utf8');"`
        );

        // Modify all the .css files in the src/assets/primevue matching /\.p-.*-success/,/^}/ to use:
        // secondary instead of surface (example for badge.css: sed -i '' -e '/\.p-.*-secondary/,/^}/ s/surface-/secondary-/g' ./src/assets/primevue/badge.css)
        await execAsync(`cd ${projectName} && find src/assets/primevue -type f -name "*.css" -exec sed -i'' -e '/\.p-.*-secondary/,/^}/ s/surface-/secondary-/g' {} +`)
        // success instead of green (example for badge.css: sed -i '' -e '/\.p-.*-success/,/^}/ s/green-/success-/g' ./src/assets/primevue/badge.css)
        await execAsync(`cd ${projectName} && find src/assets/primevue -type f -name "*.css" -exec sed -i'' -e '/\.p-.*-success/,/^}/ s/green-/success-/g' {} +`)
        // info instead of sky (example for badge.css: sed -i '' -e '/\.p-.*-info/,/^}/ s/sky-/info-/g' ./src/assets/primevue/badge.css)
        await execAsync(`cd ${projectName} && find src/assets/primevue -type f -name "*.css" -exec sed -i'' -e '/\.p-.*-info/,/^}/ s/sky-/info-/g' {} +`)
        // warning instead of orange (example for badge.css: sed -i '' -e '/\.p-.*-warn/,/^}/ s/orange-/warning-/g' ./src/assets/primevue/badge.css)
        await execAsync(`cd ${projectName} && find src/assets/primevue -type f -name "*.css" -exec sed -i'' -e '/\.p-.*-warn/,/^}/ s/orange-/warning-/g' {} +`)
        // danger instead of red (example for badge.css: sed -i '' -e '/\.p-.*-danger/,/^}/ s/red-/danger-/g' ./src/assets/primevue/badge.css)
        await execAsync(`cd ${projectName} && find src/assets/primevue -type f -name "*.css" -exec sed -i'' -e '/\.p-.*-danger/,/^}/ s/red-/danger-/g' {} +`)

        // Modify base.css to use primevue variable
        await execAsync(
            `cd ${projectName} && curl -s https://gist.githubusercontent.com/dev-at-sevenlab-nl/64954bee61b0ec6e0a7ceec6ffeec3e1/raw/base.css -o ./src/assets/base.css`
        )
        loader.succeed('Primevue added')
    }

    // fontawesome
    loader.start('Adding FontAwesome...')
    await execAsync(`cd ${projectName} && npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/vue-fontawesome@latest-3`, { silent: true })

    await execAsync(
        `cd ${projectName} && node -e "
        const fs = require('fs');
        const filePath = './src/main.ts';
        let lines = fs.readFileSync(filePath, 'utf8').split('\\n');

        let newLines = [];
        for (let i = 0; i < lines.length; i++) {
        newLines.push(lines[i]);

        if (lines[i].includes(\\"import { createPinia } from 'pinia'\\")) {
            newLines.push(\\"import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'\\");
        }

        if (lines[i].includes('app.use(router)')) {
            newLines.push('app.component(\\'FaIcon\\', FontAwesomeIcon)');
        }
        }

        fs.writeFileSync(filePath, newLines.join('\\n'), 'utf8');
        "`
    );
    loader.succeed('FontAwesome added')

    const readmePath = path.join(projectName, 'README.md');
    let readmeFile = await fs.readFile(readmePath, 'utf8');
    const lines = readmeFile.split('\n');
    if (lines[0].startsWith('# ')) {
        lines.splice(1, 0, '## Put `@start.md` in cursor window and press `enter`');
    }
    await fs.writeFile(readmePath, lines.join('\n'), 'utf8');

    if (useSupabase) {
        console.log('\n🔨 Creating Supabase...')
    }

    console.log()
    console.log(gradientText('Project created. Have fun', colors.greenGradient))
    console.log()

    shell.exit(0)
})()

// examples

// single choice
// {
//     name: 'projectType',
//     type: () => 'select',
//     message: 'What kind of project is this?',
//     initial: 0,
//     choices: (prev, answers) => [
//         {
//             title: 'Desktop App',
//             description: 'zou cool zijn als we de app map dan leeg is',
//             value: 'desktop',
//         },
//         {
//             title: 'Mobile native zou',
//             description: 'zou cool zijn als de web map dan leeg is',
//             value: 'moblie',
//         },
//         {
//             title: 'Mobile PWA',
//             value: 'pwa',
//         },
//     ],
// },
