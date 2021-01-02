import { Action } from "../../state-management/plain-state/store";

interface CommandVerifier {
    verify(action: Action): VerificationResult;
}

type VerificationResult = {
    message: string;
    failure: boolean;
}

export {
    CommandVerifier,
    VerificationResult
}
