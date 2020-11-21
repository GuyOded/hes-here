import { Client, Guild, Intents, User, Presence } from "discord.js";
import { Subject } from "rxjs"
import { config } from "./configuration/config";
import { ConfigurationParser } from "./configuration/configurer"
import auth from "./configuration/auth";
import type { PresenceDisplacement } from "./observers/presence-observer"
import { subscribePresenceObservers } from "./observers/observers-creation"

const client = new Client({
    ws: {
        intents: [Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS]
    }
});

if (!auth.token) {
    throw new Error("Unable to read security token...")
}
client.login(auth.token).catch((reason: any) => {
    console.error("Unable to login to discord...")
    throw new Error(reason)
})

client.once("ready", () => {
    console.log("Greetings from Gaspiseere!")
    const heroesGuild: Guild | undefined = client.guilds.cache.find((guild) => {
        return guild.name === config.serverName
    })

    if (!heroesGuild) {
        throw new Error(`Unable to find guild '${config.serverName}'`)
    }

    console.log(`The following guild ${heroesGuild.name} will be monitored for presence updates, my lord. *BOWS DEEPLY*`)
    console.log(`To your request, the following configuration is interpreted:\n${JSON.stringify(config, null, 2)}`)

    let notificationMapping: Map<User, User[]> | null = ConfigurationParser.createMappingFromConfig(config.notificationMapping,
        Array.from(heroesGuild.members.cache.values()))
    if (!notificationMapping) {
        console.warn("Seems as though no users are meant to be notified. Check the configuration...")
        return
    }

    const presenceSubject: Subject<PresenceDisplacement> = new Subject()
    subscribePresenceObservers(notificationMapping, presenceSubject, config.notificationCooldown)
    client.on("presenceUpdate", (oldPresence: Presence | undefined, newPresence: Presence) => {
        const presenceEvent: PresenceDisplacement = { oldPresence, newPresence }
        presenceSubject.next(presenceEvent)
    })
})
