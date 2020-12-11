import { Action, availableCommands, CooldownArgs, CooldownCommand, FollowArgs, FollowCommand } from "../../../templates";
import { Command } from "../../../command";

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
        this.commandsMap = new Map<string, CommandBuilder<Argv>>()
        // Maybe can be done programmatically? (Requires changing the Command interface so probably not too viable)
        this.commandsMap.set(availableCommands.SET_COOLDOWN.name, new CooldownCommandBuilder())
        this.commandsMap.set(availableCommands.ADD_FOLLOW.name, new FollowCommandBuilder())
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
                members: args.members
            }
        }
        return command;
    }
}

class CooldownCommandBuilder implements CommandBuilder<CooldownArgv> {
    readonly action: Action = "SET_COOLDOWN";
    public readonly build = (args: CooldownArgv): Command => {
        const command: CooldownCommand = {
            actionName: this.action,
            arguments: {
                duration: args.duration
            }
        }
        return command
    }
}

export { CommandFactory }
