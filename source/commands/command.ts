
import { Action } from "./templates"

interface Command {
    readonly actionName: Action;
    readonly arguments: Object;
}

export { Action, Command }