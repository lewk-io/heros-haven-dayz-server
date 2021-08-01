const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
const server =  new Discord.Guild();

const TOKEN = "Nzg1NDk0MzYxNDc1MzgzMzI2.X84qoQ.oPhXCEhlvtA_En4upYWocCkTLcY";

function myFunc() {
    let count;
    fs.readFile('../BEC/count.txt', 'utf8', function (err,data) {
        if (err) return console.log(err);
        console.log(`HH#3 - ${data}/70`);
        bot.user.setActivity(`${data}/70`, { details: "DayZ" });
    });
    // bot.user.setActivity(`CONFIGURING`, { details: "DayZ" });
}

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    myFunc();
    setInterval(myFunc, 30000);
});

bot.login(TOKEN);