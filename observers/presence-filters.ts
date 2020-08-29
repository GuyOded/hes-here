import type { PresenceDisplacement } from "./presence-observer"
import type { User } from "discord.js"

// Don't notify if the previous status was online (avoid sending a message when someone entered a game for example)
export const filterPreviousStatusOnline = (pd: PresenceDisplacement): boolean => {
    return pd.oldPresence?.status !== "online"
}

// Avoid sending a message if the user that have entered is not in the notification list of the monitoring user
// Plus send a message iff the new presence is online
export const newPresenceOnlineFilter = (presenceChange: PresenceDisplacement, monitoredUsers: User[]): boolean => {
    return presenceChange.newPresence.status === "online" &&
        monitoredUsers.indexOf(presenceChange.newPresence.user!) !== -1
}