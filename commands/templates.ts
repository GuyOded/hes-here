import { command } from "yargs"
import { Command } from "./command"

type Action = "SET_NOTIFICATION_LIST" | "SET_COOLDOWN"

type PartialCommnad = StrictOmit<Command, "arguments">
interface CommandTemplate extends PartialCommnad {
    readonly argumentDescription: Array<any>;
}

interface ArgumentDescription<T> {
    readonly explanation: string;
    readonly type: typeof T
}

export { Action, CommandTemplate }

// TODO: Move to a utility module
type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
