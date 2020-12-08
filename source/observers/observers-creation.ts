import { Message, User } from "discord.js";
import type { Observable, Subscription } from "rxjs";
import { PresenceObserver, PresenceDisplacement } from "./presence-observer";
import {MessageObserver} from "./message-observer"
import { filter } from "rxjs/operators";
import * as PresenceFilters from "./filters/presence-filters";
import * as MessageFilters from "./filters/message-filters";

/**
 * Creates and subscribes the necessary observers based on the given notification mapping.
 * Applies predefined filters in order to prevent excessive notifications or false notifications being sent.
 * @param notificationMapping 
 * @param presenceObservable
 * @returns A list of subscribed observers
 */
const subscribePresenceObservers = (notificationMapping: Map<User, User[]>,
    presenceObservable: Observable<PresenceDisplacement>,
    globalCooldownInMinutes: number): Subscription[] => {
    let notifiedUsers: Subscription[] = []
    notificationMapping.forEach((usersToMonitor: User[], notifyee: User) => {
        const filteredPresenceObservable = presenceObservable.pipe(
            filter(PresenceFilters.filterPreviousStatusOnline),
            filter((pd: PresenceDisplacement) => {
                return PresenceFilters.newPresenceOnlineFilter(pd, usersToMonitor)
            })
        );

        const notificationObserver: PresenceObserver = new PresenceObserver(notifyee, globalCooldownInMinutes)
        notifiedUsers.push(filteredPresenceObservable.subscribe(notificationObserver))
    })
    return notifiedUsers
}

const subscribeMessageObservers = (permittedUsers: User[], messageObservable: Observable<Message>): void => {
    permittedUsers.forEach((permittedUser: User) => {
        const filteredMessageObservable: Observable<Message> = messageObservable.pipe(
            filter((message: Message): boolean => {
                return MessageFilters.permittedUsers(message, permittedUser)
            })
        );
        const messageObserver: MessageObserver = new MessageObserver(permittedUser)
        filteredMessageObservable.subscribe(messageObserver)
    });
}

export {
    subscribePresenceObservers,
    subscribeMessageObservers
}