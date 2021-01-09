import { Guild } from "discord.js";
import { EnhancedCommand } from "../../state-management/plain-state/store";
import { CommandVerifier, VerificationResult } from "./command-verifier";
import { CooldownVerifier } from "./cooldown-verifier";
import { FollowVerifier } from "./follow-verifier";
import { getRandomSuccessResult } from "./verification-utils";

class RootVerifier implements CommandVerifier {
    private readonly verifiers: CommandVerifier[];

    constructor(guild: Guild) {
        this.verifiers = []
        this.verifiers.push(new FollowVerifier(guild));
        this.verifiers.push(new CooldownVerifier());
    }

    readonly verify = (action: EnhancedCommand): VerificationResult => {
        let result: VerificationResult = getRandomSuccessResult();

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
