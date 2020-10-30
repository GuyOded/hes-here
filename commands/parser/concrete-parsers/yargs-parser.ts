import { CommandParser } from "../command-parser"
import { Command } from "../../command";
import { CommandTemplates, ArgumentDescriptionEntry } from "../../templates"
import { availableCommands } from "../../templates"
import yargs = require('yargs')

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

interface YargsArgumentEntry extends ArgumentDescriptionEntry { alias?: Array<string> }
class YargsParserUtils {

    
    private static readonly transformAvailableCommands = (): CommandTemplates<YargsArgumentEntry> => {
        let yargsCommandTemplates: CommandTemplates<YargsArgumentEntry> = { ...availableCommands }
        yargsCommandTemplates.SET_COOLDOWN.argumentsDescription["duration"].alias = ["d"]
        yargsCommandTemplates.SET_NOTIFICATION_LIST.argumentsDescription["members"].alias = ["m"]
        return yargsCommandTemplates
    }
}
