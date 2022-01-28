require('dotenv').config()
let token = process.env.token
const { Client, Intents } = require('discord.js');
const schedule = require('node-schedule');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
    banLetter()
  const job = schedule.scheduleJob('0 0 * * *', banLetter);
});

let bannedLetter = undefined

let top5letters = ['e', 'a', 'i', 's', 'n']

let top15letters = ['r', 't', 'o', 'l', 'u', 'd', 'c', 'm', 'p', 'g']

let resteLetters = ['b', 'v', 'h', 'f', 'q', 'y', 'x', 'j', 'k', 'w', 'z']

let letterToEmoji = {
    "a": "🇦", 
    "b": "🇧",
    "c": "🇨",
    'd': "🇩",
    'e': "🇪",
    'f': "🇫",
    "g": "🇬",
    "h": "🇭",
    "i": "🇮",
    'j': "🇯",
    "k": "🇰",
    "l": "🇱",
    "m": "🇲",
    "n": "🇳",
    "o": "🇴",
    "p": "🇵",
    "q": "🇶",
    "r": "🇷",
    's': "🇸",
    "t": "🇹",
    "u": "🇺",
    "v": "🇻",
    "w": "🇼",
    "x": "🇽",
    "y": "🇾",
    "z": "🇿"
}

let URLREGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/


client.on('messageCreate', async (message)  => {
    if(message.author.bot){
        return;
    }

    if(message.content == "!lrf"){
        banLetter()
        return;
    }

    let messageParts = message.content.split(" ")


    let messageWithoutLinks= ""

    await messageParts.forEach(function(part){
        if(URLREGEX.test(part)){
            return;
        }
        messageWithoutLinks += part + " "
    })
    

    if(messageWithoutLinks.toLowerCase().includes(bannedLetter)){
        message.react(letterToEmoji[bannedLetter])
    }

})

function banLetter(){
    let numberRandom = Math.random()*100

    if(numberRandom < 3){
        bannedLetter = top5letters[Math.floor(Math.random()*top5letters.length)]
        client.user.setPresence({ activities: [{ name: bannedLetter.toUpperCase(), type:"WATCHING" }], status: 'dnd'});
        return;
    }

    if(numberRandom < 23){
        bannedLetter = top15letters[Math.floor(Math.random()*top15letters.length)] 
        client.user.setPresence({ activities: [{ name: bannedLetter.toUpperCase(), type:"WATCHING" }], status: 'dnd'});
        return;
    }

    bannedLetter = resteLetters[Math.floor(Math.random()*resteLetters.length)] 
    client.user.setPresence({ activities: [{ name: bannedLetter.toUpperCase(), type:"WATCHING" }], status: 'dnd'});
    return;
}

















client.login(token);