import { Observer } from "rxjs"
import { User, Client } from "discord.js";
import * as moment from "moment"

export class PresenceObserver implements Observer<User> {
    // Prevent overflowing the chats with notifications
    private readonly NOTIFICATION_COOLDOWN_IN_MINUTES: number = 30

    private readonly userToNotify: User
    private readonly membersToMonitor: User[]
    private lastNotificationFromUserTimestamp: Map<User, moment.Moment>
    closed?: boolean

    constructor(userToNotify: User, membersToMonitor: User[], discordClient: Client) {
        this.userToNotify = userToNotify
        this.membersToMonitor = membersToMonitor
        this.lastNotificationFromUserTimestamp = new Map()
    }

    next = (value: User) => {
        const currentTime: moment.Moment = moment()
        if (!this.lastNotificationFromUserTimestamp.get(value) ||
            currentTime.diff(this.lastNotificationFromUserTimestamp.get(value), "minutes") > this.NOTIFICATION_COOLDOWN_IN_MINUTES) {
            this.userToNotify.send(`The user "${value.username}" has entered the realm.`)
            this.lastNotificationFromUserTimestamp.set(value, currentTime)
        }
    }

    error = (err: any) => void {};
    complete = () => void {};
}