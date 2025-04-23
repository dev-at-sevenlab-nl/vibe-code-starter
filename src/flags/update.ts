import { Ora } from 'ora'
import shell from 'shelljs'
// import { red, green } from 'kolorist';
// import ncu from 'npm-check-updates';
// import execAsync from '../utils/execAsync.js';

export default async function update(l: Ora) {
    const loader = l
    loader.start('Cloning boilerplate...')

    // clone boilerplate via https or ssh
    // await execAsync('git clone https://app.buddy.works/sevenlab/sevenlab-boilerplate-app -b development temp', { silent: true }).catch(async (err) => {
    //     loader.text = 'Cloning via https failed, trying via ssh...';
    //     await execAsync('git clone buddy@app.buddy.works:sevenlab/sevenlab-boilerplate-app1 -b development temp', { silent: true }).catch((e) => { loader.fail(`${red('✖')} ${red(typeof e === 'string' ? e : 'Unknown error!')}`); shell.exit(1); });
    // });
    // loader.succeed('Cloned boilerplate');

    // // run ncu -u
    // shell.cd('temp');
    // loader.start('Updating packages...');
    // await ncu.run({
    //     packageFile: './package.json',
    //     upgrade: true,
    //     silent: true,
    //     interactive: false, // if ever needed
    // });
    // loader.succeed('Updated packages');

    // // git commit and push
    // // loader.start('Committing and pushing changes...');
    // // OFF FOR NOW UNTILL THE UPGRADE IS DONE
    // // await execAsync('git add .', { silent: true }).catch((e) => { loader.fail(`${red('✖')} ${red(typeof e === 'string' ? e : 'Unknown error!')}`); shell.exit(1); });
    // // await execAsync('git commit -m "update packages"', { silent: true }).catch((e) => { loader.fail(`${red('✖')} ${red(typeof e === 'string' ? e : 'Unknown error!')}`); shell.exit(1); });
    // // loader.succeed('Committed and pushed changes!');

    // // remove temp folder
    // loader.start('Cleaning up...');
    // await execAsync('rm -rf ./temp', { silent: true }).catch((err) => { loader.fail(`${red('✖')} ${red(typeof err === 'string' ? err : 'Unknown error!')}`); shell.exit(1); });
    // loader.succeed('Cleaned up');

    // console.log(`${green('✔')} done!`);

    loader.stop()
    shell.exit(0)
}
