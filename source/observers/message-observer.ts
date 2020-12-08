import { Observer } from "rxjs";
import { Message, User } from "discord.js";
import { StringArgparser } from "../commands/parser/concrete-parsers/string-parser/string-parser";
import { Command } from "../commands/command"

class MessageObserver implements Observer<Message> {
    readonly user: User;

    constructor(user: User) {
        this.user = user;
    }

    next = (message: Message): void => {
        let parser: StringArgparser;
        try {
            parser = new StringArgparser(message.cleanContent);
        } catch (e: any) {
            return;
        }

        parser.parse().subscribe({
            next: (command: Command) => {
                const replyString = `Parsed successfully :)\n${JSON.stringify(command)}`;
                message.channel.send(replyString);
            },
            error: (error: Error) => {
                const replyString = `Unable to parse... ${error.message}`
                message.channel.send(replyString)
            }
        })
    }

    error = (err: any): void => { }
    complete = (): void => { }

}

export {
    MessageObserver
}
