import { VerificationResult } from "./command-verifier";
import { YES_REPLIES } from "./replys";

const getRandomSuccessResult = (): VerificationResult => {
    return {
        failure: false,
        message: YES_REPLIES[Math.floor(Math.random() * YES_REPLIES.length)]
    }
}

export {
    getRandomSuccessResult
}
