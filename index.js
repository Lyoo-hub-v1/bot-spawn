const { Client, GatewayIntentBits } = require('discord.js');
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

const ID_CHANNEL_DISCORD = '1572808575179563168';
const ID_SALURAN = '0029Vb9IYpxKGGGLvms1D93K'; // ID Saluran WA kau

// 1. SETUP DISCORD
const discord = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// 2. SETUP WA
let sock;
async function startWA() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    sock = makeWASocket({ auth: state });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (u) => {
        if (u.connection === 'open') console.log('WA NYAMBUNG!');
    });
}
startWA();

// 3. BOT DENGERIN DISCORD - INI KODE KAU TADI!
discord.on('messageCreate', async (msg) => {
    if (msg.channel.id !== ID_CHANNEL_DISCORD) return;
    if (msg.embeds.length === 0) return;

    let embed = msg.embeds[0];
    let pet = embed.title || 'Unknown';
    let getField = (nama) => {
        let f = embed.fields.find(x => x.name.toLowerCase() === nama.toLowerCase());
        return f ? f.value : 'Unknown';
    };
    let rarity = getField('Rarity').toUpperCase();
    let area = getField('Area');

    if (rarity !== 'DIVINE' && rarity !== 'ETERNAL') return;

    let emojiPet = '🥚';
    if (pet.toLowerCase().includes('world burner')) emojiPet = '👼';
    else if (pet.toLowerCase().includes('angel')) emojiPet = '👼';
    else if (pet.toLowerCase().includes('demon')) emojiPet = '😈';
    else if (pet.toLowerCase().includes('gargoyle')) emojiPet = '🗿';
    else if (pet.toLowerCase().includes('dragon')) emojiPet = '🐉';

    let speed = '20B';
    if (area.toLowerCase().includes('angels')) speed = '20B';
    else if (area.toLowerCase().includes('light dark')) speed = '18B';

    let pesanWA = `*✨ ${rarity} HAS SPAWNED! ✨*\n\n` +
        `*${emojiPet} Pet: ${pet.toUpperCase()}*\n` +
        `*📍 Area: ${area.toUpperCase()}*\n` +
        `*🏃 Recommend Speed: ${speed}*\n\n` +
        `*🎮 JOIN GAME:*\n` +
        `*https://www.roblox.com/games/107778070777162/Steal-an-Egg*\n\n` +
        `*⚡ Buruan join game & steal sebelum keduluan ‼️*\n` +
        `*👀 Pantengin terus saluran ini agar tidak ketinggalan info‼️*\n` +
        `_*⛔ Dilarang copy-paste apapun yang ada disini kecuali telah izin ‼️*_\n` +
        `> *CIOO SPAWN ⚡*`;

    await sock.sendMessage(ID_SALURAN, { text: pesanWA });
});

discord.login(process.env.DISCORD_TOKEN);
