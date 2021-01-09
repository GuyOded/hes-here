import { Guild, GuildMember } from "discord.js";
import { EnhancedCommand } from "../../state-management/plain-state/store";
import { FollowArgs } from "../templates";
import { CommandVerifier, VerificationResult } from "./command-verifier";

class FollowVerifier implements CommandVerifier {
    private readonly guild: Guild;

    constructor(guild: Guild) {
        this.guild = guild;
    }

    public readonly verify = (action: EnhancedCommand): VerificationResult => {
        const success: VerificationResult = {
            failure: false,
            message: ""
        }

        if (action.actionName != "ADD_FOLLOW") {
            return success;
        }

        const args: FollowArgs = action.arguments as FollowArgs;
        const unknownMembers: string[] = args.members.filter((memberName: string) => {
            return !this.guild.members.cache.find((member: GuildMember) => {
                return memberName.toLowerCase() === member.user.username.toLowerCase();
            })
        });

        if (unknownMembers.length === 0) {
            return success;
        }

        return {
            failure: true,
            message: `My apologies, but following ${unknownMembers} is beyond my reach.`
        }
    }
}

export {
    FollowVerifier
};

