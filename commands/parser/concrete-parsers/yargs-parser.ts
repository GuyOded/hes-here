import { CommandParser } from "../command-parser"
import { Command } from "../../command";
import yargs = require('yargs')

export class YargsParser implements CommandParser {
    private readonly args: string;

    constructor(args: string) {
        this.args = args
    }

    public readonly parse = (): Command | null => {
        return null;
    }
}