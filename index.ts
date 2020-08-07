import { Client, Guild, Intents, User, Presence } from "discord.js";
import { Observer, Subject, Observable } from "rxjs"
import { filter } from "rxjs/operators"
import { config } from "./configuration/config";
import { ConfigurationParser } from "./configuration/configurer"
import auth from "./configuration/auth";
import { PresenceObserver } from "./observers/presence-observer"

const client = new Client({
    ws: {
        intents: [Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS]
    }
});

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

    const presenceSubject: Subject<Presence> = new Subject()
    subscribePresenceObservers(notificationMapping, presenceSubject)
    client.on("presenceUpdate", (oldPresence: Presence | undefined, newPresence: Presence) => {
        presenceSubject.next(newPresence)
    })
})

let subscribePresenceObservers = (notificationMapping: Map<User, User[]>, presenceObservable: Observable<Presence>): Observer<Presence>[] => {
    let notifiedUsers: Observer<Presence>[] = []
    notificationMapping.forEach((usersToMonitor: User[], notifyee: User) => {
        const filteredPresenceObservable = presenceObservable.pipe(filter((presenceEvent: Presence) => {
            return presenceEvent.status === "online" && usersToMonitor.indexOf(presenceEvent.user!) !== -1
        }))

        const notificationObserver: PresenceObserver = new PresenceObserver(notifyee)
        notifiedUsers.push(notificationObserver)
        filteredPresenceObservable.subscribe(notificationObserver)
    })
    return notifiedUsers
}

client.login(auth.token)