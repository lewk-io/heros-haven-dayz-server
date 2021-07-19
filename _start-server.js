const fs = require('fs');
const path = require('path');
const { exec, execSync, spawn } = require('child_process');

const getPath = p => p ? path.resolve(__dirname, p) : __dirname;

const getMap = /template="(.*)";/gm.exec(fs.readFileSync( getPath('serverDZ.cfg'), { encoding:'utf8' }))[1];

let mapName;
switch (true) {
    case getMap.includes('chernarus'):
        mapName = 'chernarus';
    case getMap.includes('deerisle'):
        mapName = 'deerisle';
    case getMap.includes('esseker'):
        mapName = 'esseker';
    case getMap.includes('rostow'):
        mapName = 'rostow';
    case getMap.includes('takistan'):
        mapName = 'takistan';
    default:
        mapName = 'chernarus';
}

console.log(`###### Building for map "${mapName}"`);

// Pull updates from heros-haven-dayz-server repo
execSync('git pull', { cwd: getPath() }, (err, stdout, stderr) => {
    if (err || stderr) console.log(err || stderr);
    console.log(stdout);
    console.log('###### Server repo pulled');

    // Sync submodules
    execSync('git submodule update --init --recursive', { cwd: getPath() }, (err, stdout, stderr) => {
        if (err || stderr) console.log(err || stderr);
        console.log(stdout);
        console.log('###### Submodules synced');
    })
});

// Start BEC
const BEC = spawn('BEC.exe', ['-f Config.cfg', '--dsc'], { cwd: getPath('BEC'), shell: true, detached: true });
console.log('###### Starting BEC');

// Install PlayerLoadouts dependancies and build
execSync('npm start', { cwd: getPath('profiles/PlayerLoadouts'), shell: true, detached: true }, (err, stdout, stderr) => {
    if (err || stderr) console.log(err || stderr);
    console.log(stdout);
    console.log('###### PlayerLoadouts repo installed and built');
});

// Install Trader dependancies and build
execSync(`npm install && npm run build-${mapName}`, { cwd: getPath('profiles/Trader'), shell: true, detached: true }, (err, stdout, stderr) => {
    if (err || stderr) console.log(err || stderr);
    console.log(stdout);
    console.log('###### Trader repo installed and built');
});