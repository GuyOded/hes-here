import { Guild } from "discord.js";
import { Action } from "../../state-management/plain-state/store";
import { CommandVerifier, VerificationResult } from "./command-verifier";
import { CooldownVerifier } from "./cooldown-verifier";
import { FollowVerifier } from "./follow-verifier";

class RootVerifier implements CommandVerifier {
    private readonly verifiers: CommandVerifier[];

    constructor(guild: Guild) {
        this.verifiers = []
        this.verifiers.push(new FollowVerifier(guild));
        this.verifiers.push(new CooldownVerifier());
    }

    readonly verify = (action: Action): VerificationResult => {
        let result: VerificationResult = {
            failure: false,
            message: ""
        }

        this.verifiers.find((verifier) => {
            const verifierResult: VerificationResult = verifier.verify(action);
            if (verifierResult.failure) {
                result = verifierResult;
                return true;
            }

            return false;
        })

        return result;
    }
}

export {
    RootVerifier
}
