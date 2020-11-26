import type { CommandParser } from "../command-parser"
import type { Command } from "../../command";
import type { CommandTemplates, ArgumentDescriptionEntry, Action, ArgumentsDescriptionDictionary } from "../../templates"
import yargs, { alias, Argv } from "yargs"
import { availableCommands } from "../../templates"
import { Observable, Subscriber } from "rxjs";
import { parse } from "path";

/** An interface that adds alias to the type @see ArgumentDescriptionEntry
 * (unfortunately argparse supports one alias only instead of an array of aliases) 
 */
interface ArgparseEntry extends ArgumentDescriptionEntry { alias?: string[] }
type RequiredArgparseEntry = Readonly<Required<ArgparseEntry>>
/** A utility class (for the private use of this module only) that is meant to perform all the necessary configuration of the
 *  @see yargs.Argv
 */
class ArgparserUtils {
    private static readonly DESCRIPTION = "Gaspiseere shall help you achieve what you want!";
    private static readonly PROG_NAME = "gaspiseere";
    private static parserInstance: yargs.Argv;

    public static readonly getInstance = (): yargs.Argv => {
        if (!ArgparserUtils.parserInstance) {
            ArgparserUtils.parserInstance = ArgparserUtils.getArgumentPraser()
        }

        return ArgparserUtils.parserInstance
    }

    private static readonly getArgumentPraser = (): yargs.Argv => {
        const argparseCommandTemplates: CommandTemplates<RequiredArgparseEntry> = ArgparserUtils.transformAvailableCommands();
        let commandActions: Array<string> = Object.keys(argparseCommandTemplates) as Array<Action>;
        
        // TODO: Clean nestedness
        commandActions.forEach((action: string) => {
            const argumentEntries: ArgumentsDescriptionDictionary<string, RequiredArgparseEntry> = argparseCommandTemplates[action as Action].argumentsDescription;
            yargs.command(argparseCommandTemplates[action as Action].name, "", (yargs: yargs.Argv) => {
                for (let key in argparseCommandTemplates[action as Action].argumentsDescription) {
                    const options: yargs.Options = {
                        type: argumentEntries[key].type,
                        alias: argumentEntries[key].alias,
                        desc: argumentEntries[key].explanation
                    }

                    yargs.option(key, options);
                }
            })
        })
        yargs.demandCommand()
        .scriptName(ArgparserUtils.PROG_NAME)
        .usage(`${ArgparserUtils.PROG_NAME} <command>\n${ArgparserUtils.DESCRIPTION}`)
        .version(false);

        return yargs;
    }

    private static readonly transformAvailableCommands = (): CommandTemplates<RequiredArgparseEntry> => {
        let yargsCommandTemplates: CommandTemplates<ArgparseEntry> = { ...availableCommands };
        yargsCommandTemplates.SET_COOLDOWN.argumentsDescription["duration"].alias = ["d"];
        yargsCommandTemplates.SET_NOTIFICATION_LIST.argumentsDescription["members"].alias = ["m"];
        return yargsCommandTemplates as CommandTemplates<RequiredArgparseEntry>;
    }
}

export class StringArgparser implements CommandParser {
    private readonly argline: string;
    private readonly parser: yargs.Argv;

    constructor(args: string) {
        this.argline = args;
        this.parser = ArgparserUtils.getInstance();
    }

    public readonly parse = (): Observable<Command> => {
        let parsedArgs: any
        const source: Observable<Command> = new Observable<Command>((subscriber: Subscriber<Command>) => {
            this.parser.parse(this.argline, {}, (err: Error | undefined, argv, output: string) => {
                if (argv?.help || err) {
                    subscriber.error(new Error(output))
                    return
                }
                subscriber.next(parsedArgs)
                subscriber.complete()
            })
        })
        return source
    }
}
