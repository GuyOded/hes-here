
import { Action } from "./templates"

interface Command {
    readonly action: Action;
    readonly arguments: Array<unknown>;
    readonly name: string;
}

export { Action, Command }