import { EnhancedCommand } from "../../state-management/plain-state/store";
import { CooldownArgs } from "../templates";
import { CommandVerifier, VerificationResult } from "./command-verifier";

class CooldownVerifier implements CommandVerifier {
    readonly verify = (action: EnhancedCommand): VerificationResult  => {
        const success: VerificationResult = {
            message: "",
            failure: false
        }

        if (action.actionName != "SET_COOLDOWN") {
            return success;
        }

        const args: CooldownArgs = action.arguments as CooldownArgs;
        if (args.duration <= 0) {
            return {
                message: "Any requests regarding predicting the future will be declined!",
                failure: true
            }
        }

        return success;
    }

}

export {
    CooldownVerifier
};

