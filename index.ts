import { Client, Guild, Intents, Presence } from "discord.js";
import { config, Config, NotificationMapping } from "./configuration/config";
import { ConfigurationParser } from "./configuration/configurer"
import auth from "./configuration/auth";
import { isNullOrUndefined } from "util";

const client = new Client({
    ws: {
        intents: [Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS]
    }
});

client.once("ready", () => {
    console.log("Ready!")

    const heroesGuild = client.guilds.cache.find((guild) => {
        console.log(guild.name)
        return guild.name === config.serverName
    })

    if (!heroesGuild) {
        throw new Error(`Unable to find guild '${config.serverName}'`)
    }

    client.on("presenceUpdate", (oldPresence: Presence | undefined, newPresence: Presence) => {
        console.log(newPresence)
    })
})

client.login(auth.token)