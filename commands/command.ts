
import { Action } from "./templates"

interface Command {
    readonly action: Action;
    readonly arguments: Object;
}

export { Action, Command }