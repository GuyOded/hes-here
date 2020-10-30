import { GuildMember, User } from "discord.js"
import { NotificationMapping } from "./config"

export class ConfigurationParser {
    private constructor() { }

    public static createMappingFromConfig(config: NotificationMapping[],
        availableMembers: Array<GuildMember>): Map<User, User[]> | null {
        if (!config)
            return null;

        let notificationMapping: Map<User, User[]> = new Map()
        config.forEach((mapping: NotificationMapping) => {
            // Find notifyee in available members
            const notifyee: User | undefined = availableMembers.find((member: GuildMember) => {
                return member.user.username.toLowerCase() === mapping.notifyee.toLowerCase()
            })?.user
            if (!notifyee) {
                console.warn(`Unable to find notifyee \`${mapping.notifyee}\` in member list`)
                return
            }

            // Search each monitored user in available users
            const usersToMonitor: User[] = mapping.notifyOnOnlinePresence.reduce<User[]>((filteredMembers: User[],
                userToMonitorPresence: string) => {
                const memberToMonitor: User | undefined = availableMembers.find((member: GuildMember) => {
                    return member.user.username.toLowerCase() === userToMonitorPresence.toLowerCase()
                })?.user
                if (!memberToMonitor) {
                    console.warn(`Unable to find user \`${userToMonitorPresence}\` in member list`)
                }

                filteredMembers.push(memberToMonitor!)
                return filteredMembers
            }, [])

            notificationMapping.set(notifyee, usersToMonitor)
        })

        return notificationMapping
    }
}