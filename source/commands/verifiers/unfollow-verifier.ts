import { UserState } from "../../state-management/plain-state/state-template";
import { EnhancedCommand, UserStateStore } from "../../state-management/plain-state/store";
import { CommandVerifier, VerificationResult } from "./command-verifier";

// TODO: Make the verifiers prototype
class UnfollowVerifier implements CommandVerifier {
    private readonly store: UserStateStore;

    constructor(store: UserStateStore) {
        this.store = store;
    }

    public readonly verify = (action: EnhancedCommand): VerificationResult => {
        const success = {
            failure: false,
            message: ""
        };

        if (action.actionName != "REMOVE_FOLLOW") {
            return success;
        }

        const invokerState: UserState | undefined = this.store.getState().find((userState: UserState) => {
            return userState.id === action.invoker;
        });

        if (!invokerState || !invokerState.following.length) {
            return {
                failure: true,
                message: "I can't do that.\nYou must follow someone in order to unfollow someone."
            }
        }

        return success;
    }

}

export {
    UnfollowVerifier
}
