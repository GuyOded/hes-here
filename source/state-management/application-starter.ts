import { Client, Presence, User } from "discord.js"
import { ConfigurationParser } from "../configuration/configurer"
import { config } from "../configuration/config"
import { Subject } from "rxjs";
import { PresenceDisplacement } from "../observers/presence-observer";
import { AppStateService } from "./app-state-service"

class ApplicationStarter {
    private readonly client: Client;

    constructor(client: Client) {
        if (!client.readyAt) {
            throw new Error("Receieved unready client");
        }

        this.client = client;
    }

    public readonly run = (): void => {
        console.log("Greetings from Gaspiseere!");
        const configuration: ConfigurationParser = new ConfigurationParser(this.client);
        console.log(`To your request, the following configuration is interpreted:\n${JSON.stringify(config, null, 2)}`);

        // Maybe remove null union and return an empty map instead?
        let notificationMapping: Map<User, User[]> | null = configuration.createMappingFromConfig();
        if (!notificationMapping) {
            console.warn("Seems as though no users are meant to be notified. Check the configuration...");
            notificationMapping = new Map();
        }

        const presenceSubject: Subject<PresenceDisplacement> = new Subject();
        // Give to a different object that will manage the state upon redux mutation.
        const appStateService: AppStateService = new AppStateService(notificationMapping, presenceSubject.asObservable());
        this.client.on("presenceUpdate", (oldPresence: Presence | undefined, newPresence: Presence) => {
            const presenceEvent: PresenceDisplacement = { oldPresence, newPresence }
            presenceSubject.next(presenceEvent);
        })
    }
}

export {
    ApplicationStarter
}