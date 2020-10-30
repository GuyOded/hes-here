import { Command } from "../command"

/**
 * A command parser - given some form of user input translates (if at all possible) received input to a Command
 */
export interface CommandParser {
    parse(): Command | null;
}
