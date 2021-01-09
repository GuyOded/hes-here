import { Command } from "./command";
import { PickAsPartial } from "../utility/types";

type ActionName = keyof CommandTemplates<any>;
type AvailableArgumentTypes = "string" | "number" | "array" | "boolean";

/**
 * An interface representing the comprising properties of a command.
 * Every parser may rely on this definition when it parses user input.
 * That isn't to say a parser mayn't extend this interface by adding his own properties. 
 */
type ArgumentDescriptionEntry = {
    readonly explanation: string;
    readonly type: AvailableArgumentTypes;
    readonly mandatory?: boolean;
    readonly default?: any;
}

type ArgumentsDescriptionDictionary<T extends string, U extends ArgumentDescriptionEntry> = {
    [key in T]: U
}

type CommandTemplateEntry<T extends string, U extends ArgumentDescriptionEntry> = {
    readonly name: string;
    readonly argumentsDescription: ArgumentsDescriptionDictionary<T, U>;
}
type OptionalArgumentsCommandTemplateEntry<T extends string, U extends ArgumentDescriptionEntry> = PickAsPartial<CommandTemplateEntry<T, U>, "argumentsDescription">;

type CommandTemplates<U extends ArgumentDescriptionEntry> = {
    readonly SET_COOLDOWN: CommandTemplateEntry<"duration", U>,
    readonly ADD_FOLLOW: CommandTemplateEntry<"members", U>,
    readonly LIST_FOLLOWING: OptionalArgumentsCommandTemplateEntry<"", U>
}

const availableCommands: CommandTemplates<ArgumentDescriptionEntry> = {
    ADD_FOLLOW: {
        name: "follow",
        argumentsDescription: {
            "members": {
                explanation: "A list of server members Gaspiseere will follow for you",
                type: "array",
                default: []
            }
        }
    },
    SET_COOLDOWN: {
        name: "cooldown",
        argumentsDescription: {
            "duration": {
                explanation: "The time (in minutes) Gaspiseere will wait between two notifications regarding the same member",
                type: "number",
                mandatory: true
            }
        }
    },
    LIST_FOLLOWING: {
        name: "list"
    }
}

type CooldownArgs = {
    duration: number;
}
type FollowArgs = {
    members: Array<string>;
}

interface CooldownCommand extends Command {
    readonly arguments: CooldownArgs;
}
interface FollowCommand extends Command {
    readonly arguments: FollowArgs;
}

export {
    ActionName as Action,
    CommandTemplates,
    ArgumentDescriptionEntry,
    ArgumentsDescriptionDictionary,
    CooldownArgs,
    FollowArgs,
    CooldownCommand,
    FollowCommand,
    availableCommands
}
