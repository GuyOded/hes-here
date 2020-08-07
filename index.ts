import { Client, Guild, Intents } from "discord.js";
import { config } from "./configuration/config";
import { ConfigurationParser } from "./configuration/configurer"
import auth from "./configuration/auth";

const client = new Client({
    ws: {
        intents: [Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS]
    }
});

client.once("ready", () => {
    console.log("Ready!")

    const heroesGuild: Guild | undefined = client.guilds.cache.find((guild) => {
        console.log(guild.name)
        return guild.name === config.serverName
    })

    if (!heroesGuild) {
        throw new Error(`Unable to find guild '${config.serverName}'`)
    }

    ConfigurationParser.createMappingFromConfig(config.notificationMapping, Array.from(heroesGuild.members.cache.values()))
})

client.login(auth.token)