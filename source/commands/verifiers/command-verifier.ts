import { EnhancedCommand } from "../../state-management/plain-state/store";

interface CommandVerifier {
    verify(action: EnhancedCommand): VerificationResult;
}

type VerificationResult = {
    message: string;
    failure: boolean;
}

export {
    CommandVerifier,
    VerificationResult
}
