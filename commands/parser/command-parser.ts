import { parse } from "path"
import { Command } from "../command"

export interface CommandParser {
    parse(): Command | null;
}
