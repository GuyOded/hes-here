import { GuildMember } from "discord.js"
import { NotificationMapping } from "./config"

export class ConfigurationParser {
    private constructor() { }

    public static createMappingFromConfig(config: NotificationMapping[],
        availableMembers: Array<GuildMember>): Map<GuildMember, GuildMember[]> | null {
        if (!config)
            return null;

        let notificationMapping: Map<GuildMember, GuildMember[]> = new Map()
        config.forEach((mapping: NotificationMapping) => {
            // Find notifyee in available members
            const notifyee: GuildMember | undefined = availableMembers.find((member: GuildMember) => {
                return member.user.username.toLowerCase() === mapping.notifyee.toLowerCase()
            })
            if (!notifyee) {
                console.warn(`Unable to find notifyee \`${mapping.notifyee}\` in member list`)
                return
            }

            // Search each monitored user in available users
            const usersToMonitor: GuildMember[] = mapping.notifyOnOnlinePresence.reduce<GuildMember[]>((filteredMembers: GuildMember[],
                userToMonitorPresence: string) => {
                const memberToMonitor: GuildMember | undefined = availableMembers.find((member: GuildMember) => {
                    return member.user.username.toLowerCase() === userToMonitorPresence.toLowerCase()
                })
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