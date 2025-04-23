import ora, { Ora } from 'ora'
import execAsync from '../utils/execAsync.js'

export async function installFontAwesome(projectName: string, loader: Ora) {
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
    )
    loader.succeed('FontAwesome added')
} 