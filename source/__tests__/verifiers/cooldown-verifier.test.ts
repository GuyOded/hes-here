import { VerificationResult } from "../../commands/verifiers/command-verifier";
import { CooldownCommand } from "../../commands/templates"
import { CooldownVerifier } from "../../commands/verifiers/cooldown-verifier"

const cooldownVerifier: CooldownVerifier = new CooldownVerifier();

test("Verifier should fail when cooldown is 0", () => {
    const command: CooldownCommand = {
        actionName: "SET_COOLDOWN",
        arguments: {
            duration: 0
        }
    }

    const result: VerificationResult = cooldownVerifier.verify({ ...command, invoker: "asd" });
    expect(result.failure).toEqual(true);
})
