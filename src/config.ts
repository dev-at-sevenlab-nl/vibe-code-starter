import {
    cyan, bold, yellow, green,
} from 'kolorist';
import version from './version.js';

// Long texts
export const texts = {
    help: `@wolf/create-boilerplate v${version}

${bold('INFO:')}
    This is a CLI tool that creates a new project based on the ${green('SevenLab')} boilerplate (sevenlab-boilerplate-app).
    The CLI expects to run in an empty directory cloned from Buddy. (. files excluded, .git, .vscode ect.)

    The CLI will ask you a few questions:
        ${bold('- Project name:')} (default: ${cyan('cool-new-project')}). This will change the name of the project in the package.json,
        index.html <title> and capacitor.config.json (so also the App Name and Bundle ID).
        
        ${bold('- Do you want to use assets?:')} (default: ${cyan('yes')}). If you choose ${cyan('yes')} a followup question will be asked. If you choose ${cyan('no')}, no assets will be generated.
        
        ${bold('- Logo path:')} (default: ${cyan('./')}). This is the path containing the ${yellow('logo.svg')} and (if applicable) the ${yellow('logo-dark.svg')} files.
        This file will be used to generate the assets. The CLI runs ${cyan('npx @capacitor/assets generate')} in the backround so for more info on the assets generation,
        check out the Github ${green('https://github.com/ionic-team/capacitor-assets')}.

${bold('USAGE:')} ${yellow('npx @wolf/create-boilerplate [options]')}

    ${cyan('--help')}: Show this help.

    ${cyan('--update')}: Update all packages of sevenlab-boilerplate-app to the latest versions.
    Projects created using the CLI use the latest versions of the packages automatically.
    So ${bold('ONLY')} when you have tested if the current project works with the latest versions,
    you can update the packages of the boilerplate to the latest versions.

    ${cyan('--revert')}: If the current project does not work,
    you can use the versions form the package.json of the boilerplate (which always contains the latest tested versions).
    `,
};

export const colors = {
    greenPurpleGradient: [
        { color: '#a3e635', pos: 0 },
        { color: '#a3e635', pos: 0.1 },
        { color: '#e879f9', pos: 0.5 },
        { color: '#647eff', pos: 1 },
    ],
    greenGradient: [
        { color: '#a3e635', pos: 0 },
        { color: '#a3e635', pos: 0.1 },
        { color: '#4ade80', pos: 0.5 },
        { color: '#0d9488', pos: 1 },
    ],
};

// Just a couple of example modules
export const modules = [
    { name: 'credentials', description: 'for email password authentication' },
    { name: 'webauthn', description: 'for webauthn authentication' },
    { name: 'sso', description: 'for single sign on authentication' },
    { name: '2fa', description: 'for two factor authentication' },
    { name: 'user-management', description: 'user management CRUD' },
    { name: 'permissions', description: 'user permissions CRUD' },
    { name: 'push-notifications', description: 'for push notifications' },
];

// cli maakt er @woft/credentials van
// eb doet dus npm i @wolf/credentials
