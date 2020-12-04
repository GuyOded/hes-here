import { GuildMember, User } from "discord.js"
import { NotificationMapping } from "./config"

// TODO: Turn class to an insanciable object. The discord client can be a dependency for this class in addition to the whole
// config object.
export class ConfigurationParser {
    private constructor() { }

    public static createMappingFromConfig(config: NotificationMapping[],
        availableMembers: GuildMember[]): Map<User, User[]> | null {
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

                filteredMembers.push(memberToMonitor!);
                return filteredMembers;
            }, [])

            notificationMapping.set(notifyee, usersToMonitor);
        })

        return notificationMapping;
    }

    public static getCLIPermittedUsers(permitCLI: string[], availableMembers: GuildMember[]): User[] {
        const result: User[] = [];
        permitCLI.forEach((username: string) => {
            const user: GuildMember | undefined = availableMembers.find((member: GuildMember) => {
                member.user.username.toLowerCase() === username.toLowerCase()
            });

            if (user) {
                result.push(user.user);
            }
        })

        return result;
    }
}