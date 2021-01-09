import { Observer } from "rxjs";
import { Message, User } from "discord.js";
import { StringArgparser } from "../commands/parser/concrete-parsers/string-parser/string-parser";
import { Command } from "../commands/command";
import { EnhancedCommand, UserStateStore } from "../state-management/plain-state/store";
import { CommandVerifier, VerificationResult } from "../commands/verifiers/command-verifier";

class MessageObserver implements Observer<Message> {
    private readonly user: User;
    private readonly store: UserStateStore;
    private readonly commandVerifier: CommandVerifier;

    constructor(user: User, store: UserStateStore, commandVerifier: CommandVerifier) {
        this.user = user;
        this.store = store;
        this.commandVerifier = commandVerifier;
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
        const action: EnhancedCommand = {
            ...command,
            invoker: message.author.id
        }

        const verificationResult: VerificationResult = this.commandVerifier.verify(action);
        console.debug(verificationResult);
        if (verificationResult.failure) {
            message.channel.send(verificationResult.message);
            return;
        }

        if (verificationResult.message) {
            message.channel.send(verificationResult.message);
        }

        this.store.dispatch(action);
    }
}

export {
    MessageObserver
}
