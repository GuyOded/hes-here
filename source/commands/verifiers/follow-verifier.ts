import { Guild, GuildMember } from "discord.js";
import { Action } from "../../state-management/plain-state/store";
import { FollowArgs } from "../templates";
import { CommandVerifier, VerificationResult } from "./command-verifier";

class FollowVerifier implements CommandVerifier {
    private readonly guild: Guild;

    constructor(guild: Guild) {
        this.guild = guild;
    }

    public readonly verify = (action: Action): VerificationResult => {
        const result: VerificationResult = {
            failure: false,
            message: ""
        }

        if (action.actionName != "ADD_FOLLOW") {
            return result;
        }

        const args: FollowArgs = action.arguments as FollowArgs;
        const unknownMembers: string[] = args.members.filter((memberName: string) => {
            return !this.guild.members.cache.find((member: GuildMember) => {
                return memberName.toLowerCase() === member.user.username.toLowerCase();
            })
        });

        if (!unknownMembers) {
            return result;
        }

        return {
            failure: true,
            message: `My appologies, but following ${unknownMembers} is beyond my reach.`
        }
    }
}

export {
    FollowVerifier
}
