import { Client, Intents, User, Presence } from "discord.js";
import { Subject } from "rxjs";
import { config } from "./configuration/config";
import { ConfigurationParser } from "./configuration/configurer";
import auth from "./configuration/auth";
import type { PresenceDisplacement } from "./observers/presence-observer";
import { subscribePresenceObservers } from "./observers/observers-creation";

const client = new Client({
    ws: {
        intents: [Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES]
    }
});

if (!auth.token) {
    throw new Error("Unable to read security token...");
}
client.login(auth.token).catch((reason: any) => {
    console.error("Unable to login to discord...");
    throw new Error(reason);
})

client.once("ready", () => {
    console.log("Greetings from Gaspiseere!");
    const configuration: ConfigurationParser = new ConfigurationParser(client);
    console.log(`To your request, the following configuration is interpreted:\n${JSON.stringify(config, null, 2)}`);

    // Maybe remove null union and return an empty map instead?
    let notificationMapping: Map<User, User[]> | null = configuration.createMappingFromConfig();
    if (!notificationMapping) {
        console.warn("Seems as though no users are meant to be notified. Check the configuration...");
        notificationMapping = new Map()
    }

    // Should not be in index.ts
    const presenceSubject: Subject<PresenceDisplacement> = new Subject()
    subscribePresenceObservers(notificationMapping, presenceSubject, config.notificationCooldown)
    client.on("presenceUpdate", (oldPresence: Presence | undefined, newPresence: Presence) => {
        const presenceEvent: PresenceDisplacement = { oldPresence, newPresence }
        presenceSubject.next(presenceEvent)
    })
})
