import { Observer } from "rxjs";
import { Message, User } from "discord.js";
import { StringArgparser } from "../commands/parser/concrete-parsers/string-parser/string-parser";
import { Command } from "../commands/command"
import { AppCommandStore } from "../state-management/plain-state/store";

class MessageObserver implements Observer<Message> {
    private readonly user: User;
    private readonly store: AppCommandStore;

    constructor(user: User, store: AppCommandStore) {
        this.user = user;
        this.store = store;
    }

    next = (message: Message): void => {
        let parser: StringArgparser;
        try {
            parser = new StringArgparser(message.cleanContent);
        } catch (e: any) {
            return;
        }

        console.debug(`Created parser for '${this.user.username}' with content: '${message.cleanContent}'`);

        parser.parse().subscribe({
            next: (command: Command) => {
                this.onParsedCommand(command, message);
            },
            error: (error: Error) => {
                const replyString = error.message;
                message.channel.send(replyString);
            }
        })
    }

    error = (err: any): void => { }
    complete = (): void => { }

    private readonly onParsedCommand = (command: Command, message: Message) => {
        // TODO: verify

        this.store.dispatch({
            ...command,
            invoker: message.author.id
        });
    }
}

export {
    MessageObserver
}
