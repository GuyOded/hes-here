import type { StateTemplate, UserState } from "./plain-state/state-template";
import AppState from "./app-state";
import { Guild, User, Snowflake as string, UserManager, GuildMember } from "discord.js";
import { NotificationMapping, subscribePresenceObservers } from "../observers/observers-creation";
import { Observable } from "rxjs";
import { PresenceDisplacement } from "../observers/presence-observer";
import { config } from "../configuration/config";

class AppStateFactory {
    private readonly guild: Guild; // TODO: Maybe GuildMemberManager is a better option?
    private readonly presenceObservable: Observable<PresenceDisplacement>;
    private readonly userManager: UserManager;

    constructor(guild: Guild, userManager: UserManager, presenceObservable: Observable<PresenceDisplacement>) {
        this.guild = guild;
        this.presenceObservable = presenceObservable;
        this.userManager = userManager;
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

            const followingList: User[] = userState.following.map((username: string) => {
                const resolvedUser: GuildMember | undefined = this.guild.members.cache.find((member: GuildMember) => {
                    return member.user.username.toLowerCase() === username.toLowerCase();
                });

                if (!resolvedUser) {
                    console.error(`The snowflake '${username}' is unresolvable and won't followed by ${userState.id} (${notifyee.username}).
                    The state may be corrupted.`);
                    return null;
                }

                return resolvedUser.user;
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
