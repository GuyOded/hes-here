
import { Action } from "./templates"

interface Command {
    // TODO: change to enum type
    readonly action: Action;
    // TODO: Maybe use an argument object?
    readonly arguments: Array<any>;
    readonly name: string;
}

export { Action, Command }