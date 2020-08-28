import { Observer } from "rxjs"
import { User, Presence, Message, PresenceStatus } from "discord.js";
import moment = require('moment');

export class PresenceObserver implements Observer<PresenceDisplacement> {
    // Prevent overflowing the chats with notifications
    private readonly notificationCooldownInMinutes: number
    private readonly userToNotify: User
    private lastNotificationFromUserTimestamp: Map<User, moment.Moment>
    closed?: boolean

    constructor(userToNotify: User,
        cooldownInMinutes: number = 29) {
        this.userToNotify = userToNotify
        this.lastNotificationFromUserTimestamp = new Map()
        this.notificationCooldownInMinutes = cooldownInMinutes
    }

    next = (presenceEvent: PresenceDisplacement) => {
        if (!presenceEvent || !presenceEvent.newPresence.user) {
            return
        }

        if (this.isNotInCooldown(presenceEvent) &&
            this.isUserDisturbable(this.userToNotify.presence.status)) {

            console.log(`Sending ${this.userToNotify.username} a message (${presenceEvent.newPresence.user.username} entered)`)
            this.userToNotify.send(`The user "${presenceEvent.newPresence.user.username}" has entered the realm.`).then((value: Message) => {
                console.debug(`Sent message successfully to ${this.userToNotify.username}`)
                this.lastNotificationFromUserTimestamp.set(presenceEvent.newPresence.user!, moment())
            }).catch((reason: any) => {
                console.error(`Encountered an error while trying to send a message to ${this.userToNotify.username}.
                The following error occured: ${reason}`)
            })
        }
    }

    error = (err: any) => void {};
    complete = () => void {};

    private readonly isNotInCooldown = (presenceEvent: PresenceDisplacement): boolean => {
        const currentTime: moment.Moment = moment()

        return (!this.lastNotificationFromUserTimestamp.get(presenceEvent.newPresence.user!) ||
            currentTime.diff(this.lastNotificationFromUserTimestamp.get(presenceEvent.newPresence.user!), "minutes") > this.notificationCooldownInMinutes)
    }

    private readonly isUserDisturbable = (monitoringUserStatus: PresenceStatus): boolean => {
        return monitoringUserStatus === "idle" || monitoringUserStatus === "online"
    }
}

export interface PresenceDisplacement {
    readonly oldPresence: Presence | undefined;
    readonly newPresence: Presence;
}
