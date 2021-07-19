const path = require('path');
const { spawn } = require('child_process');

const BEC = spawn('BEC.exe', ['-f Config.cfg', '--dsc'], { cwd: path.resolve('BEC'),shell: true, detached: true });

BEC.stdout.on('data', (data) => {
console.log(`stdout: ${data}`);
});
BEC.on('errorr', (code) => {
console.log(`child process errored with code ${code}`);
});
BEC.on('close', (code) => {
console.log(`child process exited with code ${code}`);
});