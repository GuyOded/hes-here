import type { CommandParser } from "../command-parser"
import type { Command } from "../../command";
import type { CommandTemplate, ArgumentDescription } from "../../templates"
import { availableCommands } from "../../templates"
import yargs = require('yargs')
import { StrictOmit } from "../../../utility/types";

interface YargsArgumentDiscription extends ArgumentDescription {
    alias?: Array<String>
}
interface YargsCommandTemplate extends StrictOmit<CommandTemplate, "argumentsDescription"> {
    argumentsDiscription: YargsArgumentDiscription
}

export class YargsParser implements CommandParser {
    private readonly args: string;
    //private static parser: yargs.Argv = yargsConfiguraiton()

    constructor(args: string) {
        this.args = args
    }

    public readonly parse = (): Command | null => {
        return null;
    }
}

class YargsParserUtils {
    public static readonly yargsConfigurationBuilder: yargs.Argv = () => {
        availableCommands.forEach((template) => {
            yargs.command(template.name, {
                
            })
        })
    
        return yargs.argv
    }

    private static readonly transformAvailableCommands = (): Array<YargsCommandTemplate> => {
        
    }
}
