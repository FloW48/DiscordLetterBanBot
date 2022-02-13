let token = require("./secret.json").token
const { Client, Intents, MessageEmbed } = require('discord.js');
const schedule = require('node-schedule');
const fs = require("fs")

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

    if(message.content == "!l"){
        const jsonString = JSON.parse(fs.readFileSync("scores.json", 'utf8'))
        const keys = Object.keys(jsonString)
        const usernames  = []
        for(let key of keys){
            await message.guild.members.fetch(key).then(member => {
                usernames.push(member.nickname)
            })
        }

        const embed = new MessageEmbed()
            .setTitle('Classement des nuls')
            .setTimestamp()
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            embed.addField(usernames[i], jsonString[key].toString())
        }
        message.channel.send({embeds: [embed]})
    }

    if(message.content == "!lrf"){
        banLetter()
        message.reply("Letter Changed")
        return;
    }

    if(message.channelId != "666563454517248006"){
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
    
    //Lost
    if(messageWithoutLinks.toLowerCase().includes(bannedLetter)){
        const id = message.author.id // => id of person who lost 

        const jsonString = JSON.parse(fs.readFileSync("scores.json", 'utf8'))
        if(!jsonString[id]){
            jsonString[id] = 0
        }
        jsonString[id] += 1
        fs.writeFileSync("scores.json", JSON.stringify(jsonString), 'utf8', 2)

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