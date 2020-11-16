import type { CommandParser } from "../command-parser"
import type { Command } from "../../command";
import type { CommandTemplates, ArgumentDescriptionEntry, Action, ArgumentsDescriptionDictionary } from "../../templates"
import { ArgumentParser, SubParser, ArgumentOptions, ArgumentError } from "argparse"
import { availableCommands } from "../../templates"

/** An interface that adds alias to the type @see ArgumentDescriptionEntry
 * (unfortunately argparse supports one alias only instead of an array of aliases) 
 */
interface ArgparseEntry extends ArgumentDescriptionEntry { alias?: [string, string] }
type RequiredArgparseEntry = Readonly<Required<ArgparseEntry>>
/** A utility class (for the private use of this module only) that is meant to perform all the necessary configuration of the
 *  @see ArgumentParser (that is a port of argparse to js)
 */
class ArgparserUtils {
    private static readonly DESCRIPTION = "Gaspiseere shall help you achieve what you want!"
    private static readonly PROG_NAME = "gaspiseere"

    public static readonly getArgumentPraser = (): ArgumentParser => {
        const argparseCommandTemplates: CommandTemplates<RequiredArgparseEntry> = ArgparserUtils.transformAvailableCommands()
        let commandActions: Array<string> = Object.keys(argparseCommandTemplates) as Array<Action>
        const argParser: ArgumentParser = new ArgumentParser({
            description: ArgparserUtils.DESCRIPTION,
            prog: ArgparserUtils.PROG_NAME,
            exit_on_error: false
        })
        const subparsers: SubParser = argParser.add_subparsers()

        commandActions.forEach((action: string) => {
            const argumentEntries: ArgumentsDescriptionDictionary<string, RequiredArgparseEntry> = argparseCommandTemplates[action as Action].argumentsDescription
            const parser: ArgumentParser = subparsers.add_parser(argparseCommandTemplates[action as Action].name)
            for (let key in argparseCommandTemplates[action as Action].argumentsDescription) {
                const options: ArgumentOptions = {}
                // TODO: clean this bit up (possibly have an easy to build json for the configuration)
                options.nargs = argumentEntries[key].type === "array" ? "+" : undefined
                options.action = argumentEntries[key].type === "boolean" ? "store_true" : undefined
                options.type = argumentEntries[key].type === "number" ? Number : String
                options.metavar = key
                parser.add_argument(argumentEntries[key].alias[0], argumentEntries[key].alias![1], options)
            }
        })

        return argParser
    }

    private static readonly transformAvailableCommands = (): CommandTemplates<RequiredArgparseEntry> => {
        let yargsCommandTemplates: CommandTemplates<ArgparseEntry> = { ...availableCommands }
        yargsCommandTemplates.SET_COOLDOWN.argumentsDescription["duration"].alias = ["-d", "--duration"]
        yargsCommandTemplates.SET_NOTIFICATION_LIST.argumentsDescription["members"].alias = ["-m", "--members"]
        return yargsCommandTemplates as CommandTemplates<RequiredArgparseEntry>
    }
}

export class StringArgparser implements CommandParser {
    private readonly argline: string;
    private readonly parser: ArgumentParser;

    constructor(args: string) {
        this.argline = args
        this.parser = ArgparserUtils.getArgumentPraser()
    }

    public readonly parse = (): Command | null => {
        const args: string[] = this.parser.convert_arg_line_to_args(this.argline)
        try {
            const result: any = this.parser.parse_args(args)
        } catch (err) {
            if (err instanceof ArgumentError)
                console.log(err.str())
        }
        return null
    }
}
