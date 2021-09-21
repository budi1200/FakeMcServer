import {createServer} from 'minecraft-protocol'
const fetch = require('node-fetch')

// Interface for mc-api resonse
interface IServerStatus {
    players: {
        online: number
    }
}

// Handle color parsing
const parseColors = (text: string) => {
    return text.replace("&", "§");
}

// Call api and get player count
const getPlayerCount = async () => {
    const url = "https://mc-api.net/v3/server/ping/slocraft.eu"
    return new Promise<number>((resolve) => {
        fetch(url)
          .then((res: { json: () => any; }) => res.json())
          .then((res: IServerStatus) => {
              resolve(res.players.online)
          })
          .catch((err: Error) => {
              console.log(err)
          })
    })
}

const server = createServer({
    'online-mode': false,   // optional
    port: 25565,           // optional
    version: '1.17.1',
    motd: parseColors("&aPotatoes\nyeet"),
    maxPlayers: 1200,
});

if (!server) {
    console.error("Error starting server")
}

console.log("Server started")

server.on('login', function(client) {
    const kickMessage = {text: "yeet"}
    client.write('kick_disconnect', { reason: JSON.stringify(kickMessage) });
    console.log(`${client.username} (${client.uuid}) tried to connect!`)
});

server.on('error', (err) => {
    console.log(err)
})

const refreshInterval = 90 // in seconds

setInterval(async () => {
    console.log("Refreshing player count")
    server.playerCount = await getPlayerCount()
    console.log(`Updated playercount ${server.playerCount}`)
}, refreshInterval * 1000)