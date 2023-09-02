module.exports = async (zaax, m, store) => {
try {
const from = m.key.remoteJid
const quoted = m.quoted ? m.quoted : m
const body = (m.mtype === 'conversation' && m.message.conversation) ? m.message.conversation : (m.mtype == 'imageMessage') && m.message.imageMessage.caption ? m.message.imageMessage.caption : (m.mtype == 'documentMessage') && m.message.documentMessage.caption ? m.message.documentMessage.caption : (m.mtype == 'videoMessage') && m.message.videoMessage.caption ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') && m.message.extendedTextMessage.text ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'templateButtonReplyMessage') && m.message.templateButtonReplyMessage.selectedId ? m.message.templateButtonReplyMessage.selectedId : ''
const budy = (typeof m.text == 'string' ? m.text : '')
const prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><`™©®Δ^βα¦|/\\©^]/.test(body) ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!`™©®Δ^βα¦|/\\©^]/gi) : '.'
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '' //kalau mau no prefix ganti jadi ini : const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
const args = body.trim().split(/ +/).slice(1)
const mime = (quoted.msg || quoted).mimetype || ''
const text = q = args.join(" ")
const ffstalk = require('./scrape/ffstalk')
const mlstalk = require('./scrape/mlstalk')
const isGroup = from.endsWith('@g.us')
const botNumber = await zaax.decodeJid(zaax.user.id)
const sender = m.key.fromMe ? (zaax.user.id.split(':')[0]+'@s.whatsapp.net' || zaax.user.id) : (m.key.participant || m.key.remoteJid)
const senderNumber = sender.split('@')[0]
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)
const groupMetadata = isGroup ? await zaax.groupMetadata(m.chat).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
const groupOwner = isGroup ? groupMetadata.owner : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false
const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false
const isGroupAdmins = isGroup ? groupAdmins.includes(sender) : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false
const tanggal = moment.tz('Asia/Jakarta').format('DD/MM/YY')

// Auto Blocked Nomor +212
if (m.sender.startsWith('212')) return zaax.updateBlockStatus(m.sender, 'block')

// Random Color
const listcolor = ['red','green','yellow','blue','magenta','cyan','white']
const randomcolor = listcolor[Math.floor(Math.random() * listcolor.length)]

// Command Yang Muncul Di Console
if (isCmd) {
console.log(chalk.yellow.bgCyan.bold(namabot), color(`[ PESAN ]`, `${randomcolor}`), color(`FROM`, `${randomcolor}`), color(`${pushname}`, `${randomcolor}`), color(`Text :`, `${randomcolor}`), color(`${body}`, `white`))
}

// Database
const contacts = JSON.parse(fs.readFileSync("./lib/database/contacts.json"))
const prem = JSON.parse(fs.readFileSync("./lib/database/premium.json"))
const ownerNumber = JSON.parse(fs.readFileSync("./lib/database/owner.json"))

// Cek Database
const isContacts = contacts.includes(sender)
const isPremium = prem.includes(sender)
const isOwner = ownerNumber.includes(senderNumber) || isBot

// Jangan Di Edit Tar Error
let list = []
for (let i of ownerNumber) {
list.push({
displayName: await zaax.getName(i + '@s.whatsapp.net'),
vcard: `BEGIN:VCARD\n
VERSION:3.0\n
N:${await zaax.getName(i + '@s.whatsapp.net')}\n
FN:${await zaax.getName(i + '@s.whatsapp.net')}\n
item1.TEL;waid=${i}:${i}\n
item1.X-ABLabel:Ponsel\n
item2.EMAIL;type=INTERNET:tesheroku123@gmail.com\n
item2.X-ABLabel:Email\n
item3.URL:https://bit.ly/39Ivus6\n
item3.X-ABLabel:YouTube\n
item4.ADR:;;Indonesia;;;;\n
item4.X-ABLabel:Region\n
END:VCARD`
})
}

// Gak Usah Di Apa Apain Jika Tidak Mau Error
try {
ppuser = await zaax.profilePictureUrl(m.sender, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}

// Fake Resize
const fkethmb = await reSize(ppuser, 300, 300)

// Cuma Fake
const sendOrder = async(jid, text, orid, img, itcount, title, sellers, tokens, ammount) => {
const order = generateWAMessageFromContent(jid, proto.Message.fromObject({
"orderMessage": {
"orderId": orid,
"thumbnail": img,
"itemCount": itcount,
"status": "INQUIRY",
"surface": "CATALOG",
"orderTitle": title,
"message": text,
"sellerJid": sellers,
"token": tokens,
"totalAmount1000": ammount,
"totalCurrencyCode": "IDR",
}
}), { userJid: jid, quoted: m })
zaax.relayMessage(jid, order.message, { messageId: order.key.id})
}

// Function Reply
const reply = (teks) => { 
zaax.sendMessage(from, { text: teks, contextInfo: { 
"externalAdReply": { 
"showAdAttribution": true, 
"title": "Bot By ZaaXxyZzModDev", 
"containsAutoReply": true, 
"mediaType": 1, 
"thumbnail": fkethmb, 
"mediaUrl": "https://youtube.com/@ZaaXxyZzModDev", 
"sourceUrl": "https://youtube.com/@ZaaXxyZzModDev" }}}, { quoted: m }) }

// fake quoted bug
const lep = { 
key: {
fromMe: [], 
participant: "0@s.whatsapp.net", ...(from ? { remoteJid: "" } : {}) 
},
'message': {
"stickerMessage": {
"url": "https://mmg.whatsapp.net/d/f/At6EVDFyEc1w_uTN5aOC6eCr-ID6LEkQYNw6btYWG75v.enc",
"fileSha256": "YEkt1kHkOx7vfb57mhnFsiu6ksRDxNzRBAxqZ5O461U=",
"fileEncSha256": "9ryK8ZNEb3k3CXA0X89UjCiaHAoovwYoX7Ml1tzDRl8=",
"mediaKey": "nY85saH7JH45mqINzocyAWSszwHqJFm0M0NvL7eyIDM=",
"mimetype": "image/webp",
"height": 40,
"width": 40,
"directPath": "/v/t62.7118-24/19433981_407048238051891_5533188357877463200_n.enc?ccb=11-4&oh=01_AVwXO525CP-5rmcfl6wgs6x9pkGaO6deOX4l6pmvZBGD-A&oe=62ECA781",
"fileLength": "99999999",
"mediaKeyTimestamp": "16572901099967",
'isAnimated': []
}}}

const hw = { 
key: {
fromMe: false, 
participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) 
},
"message": {
"audioMessage": {
"url": "https://mmg.whatsapp.net/v/t62.7114-24/56189035_1525713724502608_8940049807532382549_n.enc?ccb=11-4&oh=01_AdR7-4b88Hf2fQrEhEBY89KZL17TYONZdz95n87cdnDuPQ&oe=6489D172&mms3=true",
"mimetype": "audio/mp4",
"fileSha256": "oZeGy+La3ZfKAnQ1epm3rbm1IXH8UQy7NrKUK3aQfyo=",
"fileLength": "1067401",
"seconds": 60,
"ptt": true,
"mediaKey": "PeyVe3/+2nyDoHIsAfeWPGJlgRt34z1uLcV3Mh7Bmfg=",
"fileEncSha256": "TLOKOAvB22qIfTNXnTdcmZppZiNY9pcw+BZtExSBkIE=",
"directPath": "/v/t62.7114-24/56189035_1525713724502608_8940049807532382549_n.enc?ccb=11-4&oh=01_AdR7-4b88Hf2fQrEhEBY89KZL17TYONZdz95n87cdnDuPQ&oe=6489D172",
"mediaKeyTimestamp": "1684161893"
}}}

const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `𝘽𝙤𝙩 𝙒𝙖 𝘽𝙮 𝙕𝙖𝙖𝙓𝙭𝙮𝙕𝙯𝙈𝙤𝙙𝘿𝙚𝙫`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;zaaxBot,;;;\nFN:${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': { url: 'https://telegra.ph/file/3c485ff201d9337be14ef.jpg' }}}}
function parseMention(text = '') {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}
    
if (m.isGroup && !m.key.fromMe && !isOwner && antilink) {
if (!isBotAdmins) return
if (budy.match(`whatsapp.com`)) {
zaax.sendMessage(m.chat, {text: `*Antilink Group Terdeteksi*\n\nKamu Akan Dikeluarkan Dari Group ${groupMetadata.subject}`}, {quoted:m})
zaax.groupParticipantsUpdate(m.chat, [sender], 'remove')
zaax.sendMessage(m.chat, { delete: m.key })
}
}

switch (command) {
case "menu": {
const text12 = `*Hallo @${sender.split("@")[0]} Todd*
*Bot WhatsApp By ZaaXxyZz*
*Versions : 1.0.0*
*Date Created Script : 13/08/23*

┏━━━━『 𝘿𝘼𝙏𝘼 𝘽𝙊𝙏 』━━━━━
┃
┃• Nama Owner : *${namaDeveloper}*
┃• Nomor Owner : *@${owned.split("@")[0]}*
┃• Nama Bot : *ZaaXxyZzBotZz*
┃• Status : *${isOwner ? `Owner Bot` : `User Bot`}*
┃
┗━━━━━━━━━━━━━━━━━━

┏━━━『 *_Fitur Owner × Biasa_*』━━━━━
┃
┃</> ${prefix}join *LinkGroup*
┃</> ${prefix}pushkontak *Teks*
┃</> ${prefix}jpm *Teks*
┃</> ${prefix}gcwa *open/close*
┃</> ${prefix}payment
┃</> ${prefix}buymurpush
┃</> ${prefix}buypanel
┃</> ${prefix}rules
┃</> ${prefix}buyunchek
┃</> ${prefix}buy
┃</> ${prefix}
┗━━━━━━━━━━━━━━━━━━━━

┏━━━━━━━━━━━━━━━━━━━━━
┃ *youtube.com/@ZaaXxyZzModDev*
┗━━━━━━━━━━━━━━━━━━━━━

`
zaxx.sendMessage(from, { image: thumb, caption: ngen, mentions:[sender, owned] }, { quoted: msg })
}
break
case "script": case"sc":{
notag = `${nomerOwner}@s.whatsapp.net`
zaax.sendMessage(from,{text:`Buy Lah Enak Aja, Buy 25k No Enc @${notag.split("@")[0]}`,mentions:[notag]},{quoted:msg})
}
break
case "buymurpush":{
  reply(`*_Hallo Kack Ini Listnya_*
  
• Join Murpush 1-2 Hari : 3k
• Join MurPush 1-4 Hari : 3.500k
• Join MurPush 1-5/6 Hari : 4.350k
• Join MurPush Seminggu Full : 5.500k
• Join MurPush DuaMinggu Full : 7.150k
• Join MurPush TigaMinggu Full : 11k
• Join Murpush Permanen : 150k

Note = Di Harapkan Semua Murid Jangan Saling Ribut And Gausah Minta Reff Jika Ada Masalah Kesalahan Teknis Kendala Kecuali Baru 4 Hari!!`)
}
break
case "buypanel":{
  reply(`*_Hallo Kackk Ini List Menunya Ya Kackk_
  
• Ram & Cpu 1Gb : 1.250k
• Ram & Cpu 2Gb : 2.250k
• Ram & Cpu 3Gb : 3k
• Ram & Cpu 4Gb : 4.500k
• Ram & Cpu 5Gb : 5.550k
• Ram & Cpu 6Gb : 6K
• Ram & Cpu 7Gb : 7.650k
• Ram & Cpu 8Gb : 9k
• Ram & Cpu 9Gb : 10k
• Ram & Cpu 10Gb : 12k
• Ram & Cpu Unlimited : 15k`)
}
break
case "rules":{
  reply(`*_Ini List Rulesnya!!_*
  
• Note : Semua Buyer Yang Tidak Mengtransfer Yang Tidak Sesuai Harga Tidak Dapat Di Reff & Semua Buyer Tidak Boleh Melakukan Penipuan & Jika Terkena Penipuan Jangan Salahkan Kami Karena Kami Tidak Dapat Membantu`)
}
break
case "buyunchek":{
  reply(`*_- Hello Tod Ini Listnya -_*
  
• 5 Unchek : 1k
• 8 Unchek : 2k
• 10 Unchek : 3k
• 15 Unchek : 4k
• 19 Unchek : 5k
• 26 Unchek : 7k
• 30 Unchek : 8k
• 35 Unchek : 9k
• 38 Unchek : 10k
• 43 Unchek : 11k

*Note : Dapet Store, Ga Stor Ke Sesi/Hb, Ga Dapet No Reff`)
}
break
case "buymenu":{
zaaxx = `Hallo Todd @${sender.split("@")[0]}
*Bot WhatsApp By ZaaXxyZz*
*Versions : 1.0.0*
*Date Created Script : 13/08/23*
┏━━━『 *_Fitur Owner × Biasa_*』━━━━━
┃
┃</> ${prefix}buypanel
┃</> ${prefix}buyunchek
┃</> ${prefix}buymurpush
┗━━━━━━━━━━━━━━━━━━━━
`
}
break
case "owner":{
const repf = await zaax.sendMessage(from, {
contacts: {
displayName: `${list.length} Kontak`,
contacts: list }}, { quoted: msg })
zaax.sendMessage(from,{text:`Hai Kak @${sender.split("@")[0]}, Itu Owner Ku Dia Lagi Need Kontak Cewek Save Ya Buat Cewek, Bytheway Jangan Galak-galak Ya.`,mentions:[sender]},{quoted:repf})
}
break
case "pushkontak":
case "pk":{
if (!isOwner) return khususOwner()
if (!msg.isGroup) return reply(`Maaf Kak Fitur ${prefix+command} Hanya Bisa Di Gunakan Di Dalam Group\nUntuk Memasukan Bot Ke Dalam Group Yang Di Ingin Kan\nSilahkan Ketik Command .join linkgroup`)
if (!text) return reply(`Penggunaan Salah Silahkan Gunakan Command Seperti Ini\n${prefix+command} teks`)
await reply("_!! Push Kontak Start !!_")
const halsss = await participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
for (let men of halsss) {
zaax.sendMessage(men, { text: text })
await sleep(2000)
}
reply("*PUSH KONTAK SUCCESFUL ✅*")
}
break
case "promosi":
case "jpm": {
if (!isOwner) return khususOwner()
if (!text) return reply(`Penggunaan Salah Silahkan Gunakan Seperti Ini\n${prefix+command} Teks`)
await reply("*_!! Start !!_*")
let getGroups = await zaax.groupFetchAllParticipating()
let groups = Object.entries(getGroups).slice(0).map((entry) => entry[1])
let anu = groups.map((v) => v.id)
for (let xnxx of anu) {
await zaax.sendMessage(xnxx, { text: text })
await sleep(2000)
}
reply("*SUCCESFUL ✅*")
}
break
case "payment": {
reply(`*Menu Pembayaran By ZaaXxyZz Pedia*
*_• DANA : 083863668404_*
*_• GOPAY : 083863668404_*
*_• QRISS ALL PAY : SILAHKAN CHATS OWNER!!_*
`)};
break
case "join": {
if (!isOwner) return khususOwner()
if (!text) return reply(`Contoh ${prefix+command} linkgc`)
if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return reply('Link Invalid!')
let result = args[0].split('https://chat.whatsapp.com/')[1]
await zaax.groupAcceptInvite(result).then((res) => reply(util.format(res))).catch((err) => reply(util.format(err)))
}
break
case 'gcwa':
case 'gcp':
if (!isGroup) return reply(mess.OnlyGroup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!q) return reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
if (args[0] == "close") {
zaax.groupSettingUpdate(from, 'announcement')
reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
} else if (args[0] == "open") {
zaax.groupSettingUpdate(from, 'not_announcement')
reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
} else {
reply(`Kirim perintah #${command} _options_\nOptions : close & open\nContoh : #${command} close`)
}
break
default:
}
if (budy.startsWith('$')) {
exec(budy.slice(2), (err, stdout) => {
if(err) return reply(err)
if (stdout) return reply(stdout)
})
}
if (budy.startsWith(">")) {
if (!isOwner) return reply(mess.only.owner)
try {
let evaled = await eval(budy.slice(2))
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await reply(evaled)
} catch (err) {
reply(String(err))
}
}
} catch (e) {
console.log(e)
zaax.sendMessage("6285876059135@s.whatsapp.net", {text:`${util.format(e)}`})
}
}

let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})