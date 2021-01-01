import type { StateTemplate, UserState } from "./plain-state/state-template";
import AppState from "./app-state";
import { UserManager, User, Snowflake } from "discord.js";
import { NotificationMapping, subscribePresenceObservers } from "../observers/observers-creation";
import { Observable } from "rxjs";
import { PresenceDisplacement } from "../observers/presence-observer";
import { config } from "../configuration/config";

class AppStateFactory {
    private readonly userManager: UserManager; // TODO: Maybe GuildMemberManager is a better option?
    private readonly presenceObservable: Observable<PresenceDisplacement>

    constructor(userManager: UserManager, presenceObservable: Observable<PresenceDisplacement>) {
        this.userManager = userManager;
        this.presenceObservable = presenceObservable;
    }

    readonly translatePlainState = (state: StateTemplate): AppState => {
        let notificationMapping: NotificationMapping = new Map();

        console.debug(state);

        state.forEach((userState: UserState) => {
            const notifyee: User | null = this.userManager.resolve(userState.id);
            if (!notifyee) {
                console.error(`The snowflake '${userState.id}' is unresolvable and will not be a listener.
                The state may be corrupted.`);
                return;
            }

            const followingList: User[] = userState.following.map((snowflake: Snowflake) => {
                const resolvedUser: User | null = this.userManager.resolve(snowflake);
                if (!resolvedUser) {
                    console.error(`The snowflake '${snowflake}' is unresolvable and will followed by ${userState.id} (${notifyee.username}).
                    The state may be corrupted.`);
                    return null;
                }

                return resolvedUser;
            }).filter((user: User | null): user is User => {
                if (user) {
                    return true;
                }

                return false;
            });

            notificationMapping.set(notifyee, { usersToMonitor: followingList, cooldown: userState.cooldown });
        });

        return {
            presenceObserversSubscriptions: subscribePresenceObservers(notificationMapping, this.presenceObservable, config.notificationCooldown)
        }
    }
}

export {
    AppStateFactory
}
