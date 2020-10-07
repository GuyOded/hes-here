import { Command } from "./command"
import { StrictOmit } from "../utility/types"

type Action = "SET_NOTIFICATION_LIST" | "SET_COOLDOWN"
type AvailableArgumentTypes = "string" | "number" | "array" | "boolean"

/**
 * An interface representing the comprising properties of a command.
 * Every parser may rely on this defenition when it parses user input.
 * That isn't to say a parser mayn't extebt this interface adding his own properties. 
 */
interface CommandTemplate extends StrictOmit<Command, "arguments"> {
    readonly argumentsDescription: Array<ArgumentDescription>;
}

interface ArgumentDescription {
    readonly explanation: string;
    readonly type: AvailableArgumentTypes;
    readonly name: string;
}

const availableCommands: Array<CommandTemplate> = [
    {
        name: "follow",
        action: "SET_NOTIFICATION_LIST",
        argumentsDescription: [{
            name: "members",
            explanation: "A list of server members Gaspiseere will follow for you",
            type: "array",
        }]
    },
    {
        name: "cooldown",
        action: "SET_COOLDOWN",
        argumentsDescription: [{
            name: "duration",
            explanation: "The time (in minutes) Gaspiseere will wait between two notifications regarding the same member",
            type: "number"
        }]
    }
]

export { Action, CommandTemplate, ArgumentDescription, availableCommands }
