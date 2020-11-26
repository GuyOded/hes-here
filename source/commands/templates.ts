type Action = keyof CommandTemplates<any>
type AvailableArgumentTypes = "string" | "number" | "array" | "boolean"

/**
 * An interface representing the comprising properties of a command.
 * Every parser may rely on this definition when it parses user input.
 * That isn't to say a parser mayn't extend this interface by adding his own properties. 
 */
type ArgumentDescriptionEntry = {
    readonly explanation: string;
    readonly type: AvailableArgumentTypes;
}
type ArgumentsDescriptionDictionary<T extends string, U extends ArgumentDescriptionEntry> = {
    [key in T]: U
}
type CommandTemplateEntry<T extends string, U extends ArgumentDescriptionEntry> = {
    readonly name: string;
    readonly argumentsDescription: ArgumentsDescriptionDictionary<T, U>;
}
type CommandTemplates<U extends ArgumentDescriptionEntry> = {
    readonly SET_COOLDOWN: CommandTemplateEntry<"duration", U>
    readonly SET_NOTIFICATION_LIST: CommandTemplateEntry<"members", U>
}

const availableCommands: CommandTemplates<ArgumentDescriptionEntry> = {
    SET_NOTIFICATION_LIST: {
        name: "follow",
        argumentsDescription: {
            "members": {
                explanation: "A list of server members Gaspiseere will follow for you",
                type: "array"
            }
        }
    },
    SET_COOLDOWN: {
        name: "cooldown",
        argumentsDescription: {
            "duration": {
                explanation: "The time (in minutes) Gaspiseere will wait between two notifications regarding the same member",
                type: "number"
            }
        }
    }
}


export {
    Action,
    CommandTemplates,
    ArgumentDescriptionEntry,
    ArgumentsDescriptionDictionary,
    availableCommands
}