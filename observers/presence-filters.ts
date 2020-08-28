import type { PresenceDisplacement } from "./presence-observer"
import type { User } from "discord.js"

// Don't notify if the previous status was online (avoid sending a message when someone entered a game for example)
export const filterPreviousStatusOnline = (pd: PresenceDisplacement): boolean => {
    return pd.oldPresence?.status !== "online"
}

// Avoid sending a message if the user that have entered is not in the notification list of the monitoring user
// Plus send a message iff the new presence is online
export const newPresenceOnlineFilter = (param: PresenceDisplacementAndUserList): boolean => {
    return param.presenceDisplacement.newPresence.status === "online" &&
        param.usersToMonitor.indexOf(param.presenceDisplacement.newPresence.user!) !== -1
}

// Stupid interface I had to create in order to send extra parameters to filter (not sure how it never occurred to anyone)
export interface PresenceDisplacementAndUserList {
    presenceDisplacement: PresenceDisplacement;
    usersToMonitor: User[];
}
