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
            const notifyee: GuildMember = availableMembers.find((member: GuildMember) => {
                member.user.username === mapping.notifyee
            })
        })
    }
}