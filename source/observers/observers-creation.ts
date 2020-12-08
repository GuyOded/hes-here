import { User } from "discord.js"
import type { Observable, Subscription } from "rxjs"
import { PresenceObserver, PresenceDisplacement } from "./presence-observer"
import { filter } from "rxjs/operators"
import * as filters from "./presence-filters"

/**
 * Creates and subscribes the necessary observers based on the given notification mapping.
 * Applies predefined filters in order to prevent excessive notifications or false notifications being sent.
 * @param notificationMapping 
 * @param presenceObservable
 * @returns A list of subscribed observers
 */
export const subscribePresenceObservers = (notificationMapping: Map<User, User[]>,
    presenceObservable: Observable<PresenceDisplacement>,
    globalCooldownInMinutes: number): Subscription[] => {
    let notifiedUsers: Subscription[] = []
    notificationMapping.forEach((usersToMonitor: User[], notifyee: User) => {
        const filteredPresenceObservable = presenceObservable.pipe(
            filter(filters.filterPreviousStatusOnline),
            filter((pd: PresenceDisplacement) => {
                return filters.newPresenceOnlineFilter(pd, usersToMonitor)
            })
        )

        const notificationObserver: PresenceObserver = new PresenceObserver(notifyee, globalCooldownInMinutes)
        notifiedUsers.push(filteredPresenceObservable.subscribe(notificationObserver))
    })
    return notifiedUsers
}