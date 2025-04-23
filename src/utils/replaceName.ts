import fs from 'fs';

export default function replaceName(name: string) {
    // Set name in package.json to projectName
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8')); pkg.name = name;
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

    // Set name in index.html to projectName
    const html = fs.readFileSync('./index.html', 'utf8'); fs.writeFileSync('./index.html', html.replace(/<title>.*?<\/title>/, `<title>${name}</title>`));

    // Set appName in ./capacitor.config.ts to projectName
    const config = fs.readFileSync('./capacitor.config.ts', 'utf8'); fs.writeFileSync('./capacitor.config.ts', config.replace(/appName: '.*?'/, `appName: '${name}'`));

    // Set appId in ./capacitor.config.ts to com.sevenlab.projectName
    const config2 = fs.readFileSync('./capacitor.config.ts', 'utf8'); fs.writeFileSync('./capacitor.config.ts', config2.replace(/appId: '.*?'/, `appId: 'com.sevenlab.${name}'`));

    // replace content attr of <meta name="apple-mobile-web-app-title" content="Ionic App" /> in ./index.html
    const html2 = fs.readFileSync('./index.html', 'utf8'); fs.writeFileSync('./index.html', html2.replace(/<meta name="apple-mobile-web-app-title" content=".*?" \/>/, `<meta name="apple-mobile-web-app-title" content="${name}" />`));

    // replace <string name="app_name">sevenlab-vue3-vite-ionic-template</string> and <string name="title_activity_main">sevenlab-vue3-vite-ionic-template</string> in /android/app/src/main/res/values/strings.xml
    const strings = fs.readFileSync('./android/app/src/main/res/values/strings.xml', 'utf8'); fs.writeFileSync('./android/app/src/main/res/values/strings.xml', strings.replace(/<string name="app_name">.*?<\/string>/, `<string name="app_name">${name}</string>`).replace(/<string name="title_activity_main">.*?<\/string>/, `<string name="title_activity_main">${name}</string>`));

    // replace <string>sevenlab-vue3-vite-ionic-template</string> in /ios/App/App/Info.plist
    const plist = fs.readFileSync('./ios/App/App/Info.plist', 'utf8'); fs.writeFileSync('./ios/App/App/Info.plist', plist.replace(/<string>.*?<\/string>/, `<string>${name}</string>`));
}
