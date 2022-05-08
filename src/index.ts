import {createServer} from 'minecraft-protocol'
import dayjs from 'dayjs'

// Settings
const port = 25565
const motd = "                  &c❤ &f&lSloCraft &c❤&r\n        &aZačetek konca ali konec začetka?" // Supports basic colors - use & // https://mctools.org/motd-creator
const kickString = "&fDne &a9. 5. 2022 &fje &lSloCraft &fzaprl svoja vrata. \n\nHvala vsem, ki ste bili z nami na tej poti &c❤ \n\n&fVeč informacij na &ahttps://slocraft.eu" // Supports basic colors - use &
// Base64 encoded image
const icon = "data:image/png;base64,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"

// Interface for mc-api resonse
// interface IServerStatus {
//     players: {
//         online: number
//     }
// }

// Handle color parsing
const parseColors = (text: string) => {
    return text.replace(/&/gi, "§");
}

// Call api and get player count
// const getPlayerCount = async () => {
//     const url = "https://mc-api.net/v3/server/ping/slocraft.eu"
//     return new Promise<number>((resolve) => {
//         fetch(url)
//           .then((res: { json: () => any; }) => res.json())
//           .then((res: IServerStatus) => {
//               resolve(res.players.online)
//           })
//           .catch((err: Error) => {
//               console.log(err)
//           })
//     })
// }

const server = createServer({
    'online-mode': false,   // optional
    port: port,           // optional
    version: false,
    motd: parseColors(motd),
    maxPlayers: 1200,
});


if (!server)
    console.error("Error starting server")

server.favicon = icon
server.playerCount = 1200;

// console.log("Server started")
// getPlayerCount().then(res => {
//     server.playerCount = res
// })
const kickMessage = {text: parseColors(kickString)}
const kickObject = { reason: JSON.stringify(kickMessage) }

server.on('login', function(client) {
    client.write('kick_disconnect', kickObject);
    console.log(`[${dayjs().format("DD.MM.YYYY HH:MM")}]: ${client.username} (${client.uuid}) tried to connect!`)
});

server.on('error', (err) => {
    console.log(err)
})

// const refreshInterval = 300 // in seconds
//
// setInterval(async () => {
//     console.log("Refreshing player count")
//     server.playerCount = await getPlayerCount()
//     console.log(`Updated playercount ${server.playerCount}`)
// }, refreshInterval * 1000)