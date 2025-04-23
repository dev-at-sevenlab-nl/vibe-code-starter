import { Ora } from 'ora';
import shell from 'shelljs';
import { red, green, dim } from 'kolorist';
import execAsync from '../utils/execAsync.js';

export default async function revert(l: Ora) {
    const loader = l;

    loader.start('Reverting project...');
    // check if .package.json.bak and package.json exists
    if (!shell.test('-f', '.package.json.bak')) {
        loader.fail('No backup of package.json found!');
        console.log(`${dim('If you deleted it you will need to manually check the package.json of the boilerplate.')}`);
        shell.exit(1);
    }
    if (!shell.test('-f', 'package.json')) {
        loader.fail('No package.json found!');
        shell.exit(1);
    }

    // overwrite package.json with .package.json.bak
    await execAsync('mv .package.json.bak package.json', { silent: true }).catch((err) => { loader.stop(); console.log(`${red('✖')} ${red(typeof err === 'string' ? err : 'Unknown error!')}`); shell.exit(1); });
    loader.succeed('Reverted package.json');

    // npm install
    loader.start('Installing packages...');
    await execAsync('npm install', { silent: true }).catch((err) => { loader.stop(); console.log(`${red('✖')} ${red(typeof err === 'string' ? err : 'Unknown error!')}`); shell.exit(1); });
    loader.succeed('Installed packages');

    console.log();
    console.log(green('✔ project successfully reverted!'));
    shell.exit(0);
}
