import { Command } from "../../../command";
import { Action, availableCommands, CooldownArgs, CooldownCommand, FollowArgs, FollowCommand, UnfollowCommand } from "../../../templates";
import * as StringUtils from "../../../../utility/string-utils";

type Argv = {
    [argName: string]: unknown,
    _: string[],
    $0: string
}

type CooldownArgv = CooldownArgs & Argv;
type FollowArgv = FollowArgs & Argv;

/**
 * An auxilary parsing module used to convert @see yargs.Argv object to a @see Command
 * Specifically used by the string-parser concrete parser.
 */
class CommandFactory {
    private readonly commandsMap: Map<string, CommandBuilder<Argv>>;
    public constructor() {
        this.commandsMap = new Map<string, CommandBuilder<Argv>>();
        // Maybe can be done programmatically? (Requires changing the Command interface so probably not too viable)
        this.commandsMap.set(availableCommands.SET_COOLDOWN.name, new CooldownCommandBuilder());
        this.commandsMap.set(availableCommands.ADD_FOLLOW.name, new FollowCommandBuilder());
        this.commandsMap.set(availableCommands.LIST_FOLLOWING.name, new ListCommandBuilder());
        this.commandsMap.set(availableCommands.REMOVE_FOLLOW.name, new UnfollowCommandBuilder());
    };

    public readonly getCommand = (argv: Argv): Command | null => {
        let command: Command | null = null
        this.commandsMap.forEach((builder: CommandBuilder<Argv>, name: string) => {
            if (argv._[0] === name) {
                command = builder.build(argv)
            }
        })

        return command
    }
}

interface CommandBuilder<T extends Argv> {
    readonly action: Action;
    build(args: T): Command;
}

class FollowCommandBuilder implements CommandBuilder<FollowArgv> {
    readonly action: Action = "ADD_FOLLOW";

    public readonly build = (args: FollowArgv): Command => {
        const command: FollowCommand = {
            actionName: this.action,
            arguments: {
                members: StringUtils.convertStringArrayToLower(args.members)
            }
        }
        return command;
    }
}

class UnfollowCommandBuilder implements CommandBuilder<FollowArgv> {
    readonly action: Action = "REMOVE_FOLLOW";

    public readonly build = (args: FollowArgv): Command => {
        const command: UnfollowCommand = {
            actionName: this.action,
            arguments: {
                members: StringUtils.convertStringArrayToLower(args.members)
            }
        }
        return command;
    }
}

class CooldownCommandBuilder implements CommandBuilder<CooldownArgv> {
    readonly action: Action = "SET_COOLDOWN";

    public readonly build = (args: CooldownArgv): Command => {
        if (Array.isArray(args.duration)) {
            args.duration = args.duration[args.duration.length - 1];
        }
        const command: CooldownCommand = {
            actionName: this.action,
            arguments: {
                duration: args.duration
            }
        }
        return command
    }
}

class ListCommandBuilder implements CommandBuilder<Argv> {
    readonly action: Action = "LIST_FOLLOWING";

    public readonly build = (args: Argv): Command => {
        return {
            actionName: this.action,
            arguments: {}
        }
    }

}

export { CommandFactory };
