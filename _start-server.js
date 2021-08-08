const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const { copyFile } = require('path');
const { exec, execSync, spawn } = require('child_process');
const { Console } = require('console');

const enableSyncThis = true;
const enableStartBEC = true;
const enableSyncPlayerLoadouts = true;
const enableSyncTrader = true;
const enableSyncSubmodules = true;
const enableSyncProfileByMap = true;

const getPath = p => p ? path.resolve(__dirname, p) : __dirname;

const getMap = /template="(.*)";/gm.exec(fs.readFileSync( getPath('serverDZ.cfg'), { encoding:'utf8' }))[1];

let mapName;
switch (true) {
    case getMap.toLowerCase().includes('chernarus'):
        mapName = 'chernarus';
        break;
    case getMap.toLowerCase().includes('chiemsee'):
        mapName = 'chiemsee';
        break;
    case getMap.toLowerCase().includes('deerisle'):
        mapName = 'deerisle';
        break;
    case getMap.toLowerCase().includes('esseker'):
        mapName = 'esseker';
        break;
    case getMap.toLowerCase().includes('rostow'):
        mapName = 'rostow';
        break;
    case getMap.toLowerCase().includes('takistan'):
        mapName = 'takistan';
        break;
    default:
        mapName = 'chernarus';
}

console.log(`###### Building for map "${mapName}"`);

// Sync with profile repo
if (enableSyncSubmodules) {
    execSync('git submodule update --init --recursive --remote', { cwd: getPath('profiles'), shell: true, detached: true }, (err, stdout, stderr) => {
        if (err || stderr) console.log(err || stderr);
        console.log(stdout);
        console.log('###### Submodules synced');
        execSync('git submodule foreach git pull origin main', { cwd: getPath('profiles') }, (err, stdout, stderr) => {
            if (err || stderr) console.log(err || stderr);
            console.log(stdout);
            console.log('###### Submodules synced');
        });
    });
}

// Pull updates from heros-haven-dayz-server repo
if (enableSyncThis) {
    execSync('git pull', { cwd: getPath() }, (err, stdout, stderr) => {
        if (err || stderr) console.log(err || stderr);
        console.log(stdout);
        console.log('###### Server repo pulled');

        // Sync submodules
        execSync('git submodule update --init --recursive --remote', { cwd: getPath() }, (err, stdout, stderr) => {
            if (err || stderr) console.log(err || stderr);
            console.log(stdout);
            console.log('###### Submodules synced');
        });
        execSync('git submodule foreach git pull origin main', { cwd: getPath('profiles') }, (err, stdout, stderr) => {
            if (err || stderr) console.log(err || stderr);
            console.log(stdout);
            console.log('###### Submodules synced');
        });
    });
}

if (enableSyncPlayerLoadouts) {
    console.log('###### Start PlayerLoadouts');
    // Install PlayerLoadouts dependancies and build
    execSync('npm start', { cwd: getPath('profiles/PlayerLoadouts'), shell: true, detached: true }, (err, stdout, stderr) => {
        if (err || stderr) console.log(err || stderr);
        console.log(stdout);
        console.log('###### PlayerLoadouts repo installed and built');
    });
}

if (enableSyncTrader) {
    execSync(`npm install && npm run build-${mapName}`, { cwd: getPath('profiles/Trader'), shell: true, detached: true }, (err, stdout, stderr) => {
        if (err || stderr) console.log(err || stderr);
        console.log(stdout);
        console.log('###### Trader repo installed and built');
    });
}

if (enableSyncProfileByMap) {
    // Copy profile configuration for map
    console.log(`----------------------------------------- ${getMap}`)
    console.log(fs.existsSync(getPath(`profiles/_MAPS/${getMap}`)))
    if (getMap && fs.existsSync(getPath(`profiles/_MAPS/${getMap}`))) {
        fse.copySync(getPath(`profiles/_MAPS/${getMap}/`), getPath('profiles/'), { overwrite: true }, err => {
            if (err) console.error(err);
            console.log("success!");
        });
    }
}

if (enableStartBEC) {
    // Start BEC
    const BEC = spawn('BEC.exe', ['-f Config.cfg', '--dsc'], { cwd: getPath('BEC'), shell: true, detached: true });
    console.log('###### Starting BEC');
}