const path = require('path');
const { exec, spawn } = require('child_process');

const getPath = p => path.resolve(p)

const BEC = spawn('BEC.exe', ['-f Config.cfg', '--dsc'], { cwd: getPath('BEC'), shell: true, detached: true });
const TRADER = spawn('git pull && npm install && npm run build-chernarus', [], { cwd: getPath('profiles/Trader'), shell: true, detached: true });

exec('npm install', { cwd: getPath('profiles/Trader'), shell: true, detached: true }, (err, stdout, stderr) => {
    if (err || stderr) console.log(err || stderr);
    console.log(stdout);
})