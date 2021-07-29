const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const { copyFile } = require('path');
const { exec, execSync, spawn } = require('child_process');

const enableSyncThis = false;
const enableStartBEC = false;
const enableSyncPlayerLoadouts = false;
const enableSyncTrader = false;
const enableSyncSubmodules = false;
const enableSyncProfileByMap = true;

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

// Sync with profile repo
if (enableSyncSubmodules) {
    execSync('git submodule update --init --recursive', { cwd: getPath('profiles'), shell: true, detached: true }, (err, stdout, stderr) => {
        if (err || stderr) console.log(err || stderr);
        console.log(stdout);
        console.log('###### Submodules synced');
    });
}

// Pull updates from heros-haven-dayz-server repo
if (enableSyncThis) {
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
}

if (enableStartBEC) {
    // Start BEC
    const BEC = spawn('BEC.exe', ['-f Config.cfg', '--dsc'], { cwd: getPath('BEC'), shell: true, detached: true });
    console.log('###### Starting BEC');
}

if (enableSyncPlayerLoadouts) {
    // Install PlayerLoadouts dependancies and build
    execSync('npm start', { cwd: getPath('profiles/PlayerLoadouts'), shell: true, detached: true }, (err, stdout, stderr) => {
        if (err || stderr) console.log(err || stderr);
        console.log(stdout);
        console.log('###### PlayerLoadouts repo installed and built');
    });
}

// Install Trader dependancies and build
if (enableSyncTrader) {
    execSync(`npm install && npm run build-${mapName}`, { cwd: getPath('profiles/Trader'), shell: true, detached: true }, (err, stdout, stderr) => {
        if (err || stderr) console.log(err || stderr);
        console.log(stdout);
        console.log('###### Trader repo installed and built');
    });
}

if (enableSyncProfileByMap) {
    // Copy profile configuration for map
    if (getMap && fs.existsSync(getPath(`profiles/_MAPS/${getMap}`))) {
        fse.copySync(getPath(`profiles/_MAPS/${getMap}/`), getPath('profiles/'), { overwrite: true }, err => {
            if (err) console.error(err);
            console.log("success!");
        });
    }
}

// { overwrite: true }