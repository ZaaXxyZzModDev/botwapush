require("./module")

global.owner = "6283863668404"
global.namabot = "ZaaXxyZz Pedia"
global.namaCreator = "ZaaXxyZz Pedia"
global.autoJoin = false
global.antilink = false
global.codeInvite = "-"
global.thumb = fs.readFileSync("./logo.jpg")
global.audionya = fs.readFileSync("./lib/sound.mp3")
global.tekspushkon = ""
global.tekspushkonv2 = ""
global.packname = ""
global.author = "By ZaaXxyZz Pedia"

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
