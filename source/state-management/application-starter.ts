import { Client, Guild, Message, Presence, User } from "discord.js";
import { Subject } from "rxjs";
import { CommandVerifier } from "../commands/verifiers/command-verifier";
import { RootVerifier } from "../commands/verifiers/root-verifier";
import { config } from "../configuration/app-config";
import { ConfigurationParser } from "../configuration/configurer";
import { subscribeMessageObservers } from "../observers/observers-creation";
import { PresenceDisplacement } from "../observers/presence-observer";
import { AppStateFactory } from "./app-state-factory";
import { AppStateService } from "./app-state-service";
import { ResponseEnhancer } from "./plain-state/enhancers/response-enhancer";
import { setCooldownReducer } from "./plain-state/reducers/cooldown-reducers";
import { followReducer, unfollowReducer } from "./plain-state/reducers/follow-reducers";
import { StateTemplate } from "./plain-state/state-template";
import { Listener, UserStateStore, UserStateStoreImpl } from "./plain-state/store";

/* TODO: The application starter should send signals to other classes to start performing their job
   This logic should not be over complicated though. For now just perform logic that doesn't belong to this class here in separate methods */
// TODO: Remove unnecessary logic from this class
class ApplicationStarter {
    private readonly client: Client;
    private readonly store: UserStateStore;
    private readonly appStateFactory: AppStateFactory;
    private readonly presenceSubject: Subject<PresenceDisplacement>;
    private readonly rootVerifier: CommandVerifier;
    private appStateService: AppStateService;

    constructor(client: Client) {
        if (!client.readyAt) {
            throw new Error("Receieved unready client");
        }

        // TODO: Move this to a different class
        const heroesGuild: Guild | undefined = client.guilds.cache.find((guild) => {
            return guild.name === config.serverName;
        })

        if (!heroesGuild) {
            throw new Error(`Unable to find guild '${config.serverName}'`);
        }

        this.client = client;
        // Create a method for the purpose of getting an empty store
        const plainStore: UserStateStore = new UserStateStoreImpl([followReducer, unfollowReducer, setCooldownReducer], [], this.storeListener);
        this.store = new ResponseEnhancer(plainStore, heroesGuild);
        this.presenceSubject = new Subject<PresenceDisplacement>();
        this.appStateFactory = new AppStateFactory(heroesGuild, client.users, this.presenceSubject.asObservable());
        this.rootVerifier = new RootVerifier(heroesGuild, this.store);
        this.appStateService = new AppStateService({ presenceObserversSubscriptions: [] });
    }

    public readonly run = (): void => {
        console.log("Greetings from Gaspiseere!");
        const configuration: ConfigurationParser = new ConfigurationParser(this.client);
        console.log(`To your request, the following configuration is interpreted:\n${JSON.stringify(config, null, 2)}`);

        // Maybe remove null union and return an empty map instead?
        let notificationMapping: Map<User, User[]> | null = configuration.createMappingFromConfig();
        if (!notificationMapping || !notificationMapping.size) {
            console.warn("Seems as though no users are meant to be notified. Check the configuration...");
            notificationMapping = new Map();
        }

        // TODO: Provide an abstraction for this repeating logic
        // Give to a different object that will manage the state upon redux mutation.
        this.client.on("presenceUpdate", (oldPresence: Presence | undefined, newPresence: Presence) => {
            const presenceEvent: PresenceDisplacement = { oldPresence, newPresence }
            this.presenceSubject.next(presenceEvent);
        });

        const messageSubject: Subject<Message> = new Subject();
        subscribeMessageObservers(configuration.getCLIPermittedUsers(), messageSubject.asObservable(), this.store, this.rootVerifier);
        this.client.on("message", (message: Message) => {
            messageSubject.next(message);
        });
    }

    // TODO: Probably shouldn't be here
    private readonly storeListener: Listener = (plainState: StateTemplate): void => {
        this.appStateService.destroy();
        this.appStateService = new AppStateService(this.appStateFactory.translatePlainState(plainState));
    }
}

export {
    ApplicationStarter
};
