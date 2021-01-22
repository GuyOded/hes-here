import type { CommandParser } from "../../command-parser";
import type { Command } from "../../../command";
import type { CommandTemplates, ArgumentDescriptionEntry, Action, ArgumentsDescriptionDictionary } from "../../../templates";
import yargs from "yargs";
import { availableCommands } from "../../../templates";
import { Observable, Subscriber } from "rxjs";
import { CommandFactory } from "./command-builders";

/** An interface that adds alias to the type @see ArgumentDescriptionEntry
 */
interface ArgparseEntry extends ArgumentDescriptionEntry { alias?: string[] }
type RequiredArgparseEntry = Readonly<Required<ArgparseEntry>>
/** A utility class (for the private use of this module only) that is meant to perform all the necessary configuration of the
 *  @see yargs.Argv
 */
class ArgparserUtils {
    private static readonly DESCRIPTION = "Gaspiseere shall help you achieve what you want!";
    private static readonly PROG_NAME = "!";
    private static parserInstance: yargs.Argv;

    public static readonly getInstance = (): yargs.Argv => {
        if (!ArgparserUtils.parserInstance) {
            ArgparserUtils.parserInstance = ArgparserUtils.getArgumentPraser();
        }

        return ArgparserUtils.parserInstance;
    }

    private static readonly getArgumentPraser = (): yargs.Argv => {
        const argparseCommandTemplates: CommandTemplates<RequiredArgparseEntry> = ArgparserUtils.transformAvailableCommands();
        let commandActions: Array<string> = Object.keys(argparseCommandTemplates) as Array<Action>;

        // TODO: Clean nestedness
        commandActions.forEach((action: string) => {
            const argumentEntries: ArgumentsDescriptionDictionary<string, RequiredArgparseEntry> | undefined = argparseCommandTemplates[action as Action].argumentsDescription;
            yargs.command(argparseCommandTemplates[action as Action].name, "", (yargs: yargs.Argv) => {
                if (!argumentEntries) {
                    return;
                }

                for (let key in argparseCommandTemplates[action as Action].argumentsDescription) {
                    const demand: boolean = argumentEntries[key]?.mandatory ? true : false;
                    const defaultVal: any = argumentEntries[key]?.default ? argumentEntries[key]?.default : undefined;
                    const options: yargs.Options = {
                        type: argumentEntries[key].type,
                        alias: argumentEntries[key].alias,
                        desc: argumentEntries[key].explanation,
                        default: defaultVal,
                        demandOption: demand
                    }

                    yargs.option(key, options);
                }
            })
        })
        yargs.demandCommand()
            .scriptName(ArgparserUtils.PROG_NAME)
            .strict()
            .usage(`${ArgparserUtils.PROG_NAME} <command>\n${ArgparserUtils.DESCRIPTION}`)
            .version(false);

        return yargs;
    }

    private static readonly transformAvailableCommands = (): CommandTemplates<RequiredArgparseEntry> => {
        let yargsCommandTemplates: CommandTemplates<ArgparseEntry> = { ...availableCommands };
        yargsCommandTemplates.SET_COOLDOWN.argumentsDescription["duration"].alias = ["d"];
        yargsCommandTemplates.ADD_FOLLOW.argumentsDescription["members"].alias = ["m"];
        yargsCommandTemplates.REMOVE_FOLLOW.argumentsDescription["members"].alias = ["m"];
        return yargsCommandTemplates as CommandTemplates<RequiredArgparseEntry>;
    }

    public static readonly getProgName = (): string => {
        return ArgparserUtils.PROG_NAME
    }
}

export class StringArgparser implements CommandParser {
    private readonly argline: string;
    private readonly parser: yargs.Argv;

    constructor(args: string) {
        this.argline = args.trim();
        this.parser = ArgparserUtils.getInstance();

        if (!this.argline.startsWith(ArgparserUtils.getProgName())) {
            throw new Error(`Commands must start with ${ArgparserUtils.getProgName()}`)
        }
    }

    public readonly parse = (): Observable<Command> => {
        const source: Observable<Command> = new Observable<Command>((subscriber: Subscriber<Command>) => {
            this.parser.parse(StringArgparser.stripProgName(this.argline), {}, (err: Error | undefined, argv, output: string) => {
                if (argv?.help || err) {
                    // TODO: Define a custom error to represent the two different cases
                    subscriber.error(new Error(output));
                    subscriber.complete();
                    return;
                }

                const command: Command | null = new CommandFactory().getCommand(argv)
                if (!command) {
                    throw new TypeError(`Command: ${this.argline} was unparsable and uncaught in yargs validation`)
                }

                subscriber.next(command);
                subscriber.complete();
            })
        })
        return source
    }

    private static readonly stripProgName = (argline: string): string => {
        return argline.substring(ArgparserUtils.getProgName().length).trimLeft()
    }
}

const PREFIX = ArgparserUtils.getProgName();
export {
    PREFIX
}
