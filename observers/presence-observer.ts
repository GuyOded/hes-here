import { Observer } from "rxjs"
import { User, Presence } from "discord.js";
import moment = require('moment');

export class PresenceObserver implements Observer<Presence> {
    // Prevent overflowing the chats with notifications
    private readonly NOTIFICATION_COOLDOWN_IN_MINUTES: number = 30

    private readonly userToNotify: User
    private lastNotificationFromUserTimestamp: Map<User, moment.Moment>
    closed?: boolean

    constructor(userToNotify: User) {
        this.userToNotify = userToNotify
        this.lastNotificationFromUserTimestamp = new Map()
    }

    next = (presenceEvent: Presence) => {
        const currentTime: moment.Moment = moment()
        if (!presenceEvent || !presenceEvent.user) {
            return
        }

        if ((!this.lastNotificationFromUserTimestamp.get(presenceEvent.user) ||
            currentTime.diff(this.lastNotificationFromUserTimestamp.get(presenceEvent.user), "minutes") > this.NOTIFICATION_COOLDOWN_IN_MINUTES) &&
            (this.userToNotify.presence.status === "idle" ||
            this.userToNotify.presence.status === "online")) {
            console.log(`Sending ${this.userToNotify.username} a message`)
            this.userToNotify.send(`The user "${presenceEvent.user.username}" has entered the realm.`)
            this.lastNotificationFromUserTimestamp.set(presenceEvent.user, currentTime)
        }
    }

    error = (err: any) => void {};
    complete = () => void {};
}