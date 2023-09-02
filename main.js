require("./lib/global")

const func = require("./lib/place")

async function startSesi() {

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const { state, saveCreds } = await useMultiFileAuthState(`./session`)
const { version, isLatest } = await fetchLatestBaileysVersion()

const connectionOptions = {
version,
keepAliveIntervalMs: 30000,
printQRInTerminal: true,
logger: pino({ level: "fatal" }),
auth: state,
browser: ["HYUUOFFC`", "IOS", "4.1.0"],
}

const zaax = func.makeWASocket(connectionOptions)

store.bind(zaax.ev)

zaax.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
const reason = new Boom(lastDisconnect?.error)?.output.statusCode
console.log(color(lastDisconnect.error, 'deeppink'))
if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
process.exit()
} else if (reason === DisconnectReason.badSession) {
console.log(color(`Bad Session File, Please Delete Session and Scan Again`))
process.exit()
} else if (reason === DisconnectReason.connectionClosed) {
console.log(color('[SYSTEM]', 'white'), color('Connection closed, reconnecting...', 'deeppink'))
process.exit()
} else if (reason === DisconnectReason.connectionLost) {
console.log(color('[SYSTEM]', 'white'), color('Connection lost, trying to reconnect', 'deeppink'))
process.exit()
} else if (reason === DisconnectReason.connectionReplaced) {
console.log(color('Connection Replaced, Another New Session Opened, Please Close Current Session First'))
zaax.logout()
} else if (reason === DisconnectReason.loggedOut) {
console.log(color(`Device Logged Out, Please Scan Again And Run.`))
zaax.logout()
} else if (reason === DisconnectReason.restartRequired) {
console.log(color('Restart Required, Restarting...'))
await startSesi()
} else if (reason === DisconnectReason.timedOut) {
console.log(color('Connection TimedOut, Reconnecting...'))
startSesi()
}
} else if (connection === "connecting") {
start(`1`, `Connecting...`)
} else if (connection === "open") {
success(`1`, `Tersambung`)
if (autoJoin) {
zaax.groupAcceptInvite(codeInvite)
}
}
})

zaax.ev.on('messages.upsert', async (chatUpdate) => {
try {
m = chatUpdate.messages[0]
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (m.key && m.key.remoteJid === 'status@broadcast') return zaax.readMessages([m.key])
if (!zaax.public && !m.key.fromMe && chatUpdate.type === 'notify') return
if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
m = func.smsg(zaax, m, store)
require("./zaax")(zaax, m, store)
} catch (err) {
console.log(err)
}
})

zaax.ev.on('group-participants.update', async (anu) => {
console.log(anu)
try {
let metadata = await zaax.groupMetadata(anu.id)
let participants = anu.participants
for (let num of participants) {
try {
ppuser = await zaax.profilePictureUrl(num, 'image')
} catch {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
try {
ppgroup = await zaax.profilePictureUrl(anu.id, 'image')
} catch {
ppgroup = 'https://i.ibb.co/s2KvYYf/20230524-060103.png'
}
let nameUser = await zaax.getName(num)
let membr = metadata.participants.length
if (anu.action == 'add') {
(`${nameUser}`, `${metadata.subject}`, `${ppgroup}`, `${membr}`, `${ppuser}`, `https://i.ibb.co/LgWsTJC/1685442424826.jpg`)
zaax.sendMessage(anu.id, { image: fs.readFileSync(`./lib/tmp/welcome1.png`), mentions: [num], caption: `✧━━━━━━[ *WELCOME* ]━━━━━━✧

┏––––––━━━━━━━━•
│⫹⫺ YT : https://youtube.com/@ZaaXxyZzModDev
┣━━━━━━━━┅┅┅
│( 👋 Hallo @${num.split('@')[0]} ⁩)
├[ *INTRO* ]—
│ *Nama:* 
│ *Umur:* 
│ *Gender:*
┗––––––━━┅┅┅

––––––┅┅ *DESCRIPTION* ┅┅––––––
${metadata.desc}` })
} else if (anu.action == 'remove') {
(`${nameUser}`, `${metadata.subject}`, `${ppgroup}`, `${membr}`, `${ppuser}`, `https://i.ibb.co/LgWsTJC/1685442424826.jpg`)
zaax.sendMessage(anu.id, { image: fs.readFileSync(`./lib/tmp/goodbye1.png`), mentions: [num], caption: `✧━━━━━━[ *GOOD BYE* ]━━━━━━✧
Sayonara *@${num.split('@')[0]}* 
Jangan Balik Lagi Yaa 👋

*G O O D B Y E*'` })
}
}
} catch (err) {
console.log(err)
}
})

zaax.ev.on('contacts.update', (update) => {
for (let contact of update) {
let id = zaax.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}
})

zaax.public = true

zaax.ev.on('creds.update', saveCreds)
return zaax
}

startSesi()

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err)
})