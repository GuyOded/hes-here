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

        if (unknownMembers.length == 0) {
            return success;
        }

        // Customize message based on input
        let message: string = `My apologies, but following ${unknownMembers} is beyond my reach.`;
        const numericUsernames: string[] = unknownMembers.filter((memberName: string) => {
            return /^\d+$/.test(memberName);
        });
        if (numericUsernames.length != 0) {
            message += ` (What the hell kind of name is ${numericUsernames[0]} anyway?)`;
        }

        return {
            failure: true,
            message: message
        }
    }
}

export {
    FollowVerifier
};

