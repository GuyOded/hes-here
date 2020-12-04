import { Client, Guild, GuildMember, User } from "discord.js"
import { config, NotificationMapping } from "./config"

// TODO: Turn class to an insanciable object. The discord client can be a dependency for this class in addition to the whole
// config object.
export class ConfigurationParser {
    private readonly availableMembers: GuildMember[]
    public constructor(client: Client) {
        const heroesGuild: Guild | undefined = client.guilds.cache.find((guild) => {
            return guild.name === config.serverName
        })

        if (!heroesGuild) {
            throw new Error(`Unable to find guild '${config.serverName}'`)
        }

        console.log(`The following guild ${heroesGuild.name} will be monitored for presence updates, my lord. *BOWS DEEPLY*`)
        this.availableMembers = Array.from(heroesGuild.members.cache.values())
    }

    public createMappingFromConfig(): Map<User, User[]> | null {
        if (!config)
            return null;

        let notificationMapping: Map<User, User[]> = new Map()
        config.notificationMapping.forEach((mapping: NotificationMapping) => {
            // Find notifyee in available members
            const notifyee: User | undefined = this.availableMembers.find((member: GuildMember) => {
                return member.user.username.toLowerCase() === mapping.notifyee.toLowerCase()
            })?.user
            if (!notifyee) {
                console.warn(`Unable to find notifyee \`${mapping.notifyee}\` in member list`)
                return
            }

            // Search each monitored user in available users
            const usersToMonitor: User[] = mapping.notifyOnOnlinePresence.reduce<User[]>((filteredMembers: User[],
                userToMonitorPresence: string) => {
                const memberToMonitor: User | undefined = this.availableMembers.find((member: GuildMember) => {
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

    public getCLIPermittedUsers(): User[] {
        const result: User[] = [];
        config.permitChatCLI.forEach((username: string) => {
            const user: GuildMember | undefined = this.availableMembers.find((member: GuildMember) => {
                member.user.username.toLowerCase() === username.toLowerCase()
            });

            if (user) {
                result.push(user.user);
            }
        })

        return result;
    }
}