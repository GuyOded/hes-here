import { Action, availableCommands, CooldownCommand, FollowCommand } from "../../commands/templates"
import { StringArgparser } from "../../commands/parser/concrete-parsers/string-parser/string-parser"
import { Command } from "../../commands/command"

test('Test general help message', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere help")
    let error: string = ""
    parser.parse().subscribe({
        error: (err: Error) => {
            error = err.message
        }
    })
    expect(error).toEqual(expect.stringContaining(availableCommands.SET_COOLDOWN.name))
    expect(error).toEqual(expect.stringContaining(availableCommands.ADD_FOLLOW.name))
    expect(error).toEqual(expect.stringContaining(availableCommands.LIST_FOLLOWING.name))
})

test('Test follow command help message', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere cooldown --help");
    let error: string = "";
    parser.parse().subscribe({
        error: (err: Error) => {
            error = err.message;
        }
    })
    expect(error).toEqual(expect.stringContaining("-d"));
    expect(error).toEqual(expect.stringContaining("--duration"));
})

test('Test list command help message', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere list --help");
    let error: string = "";
    parser.parse().subscribe({
        error: (err: Error) => {
            error = err.message;
        }
    })
    expect(error).toEqual(expect.stringContaining(availableCommands.LIST_FOLLOWING.name));
})

test('Test follow command help message', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere follow --help");
    parser.parse().subscribe({
        error: (err: Error) => {
            expect(err.message).toEqual(expect.stringContaining("-m"))
            expect(err.message).toEqual(expect.stringContaining("--members"))
        }
    })
})

test('Test follow command help message with help command', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere follow help");
    parser.parse().subscribe({
        error: (err: Error) => {
            expect(err.message).toEqual(expect.stringContaining("-m"))
            expect(err.message).toEqual(expect.stringContaining("--members"))
        }
    })
})

test('Should return follow command', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere follow --members gaspiseere abcd @qwer");
    parser.parse().subscribe({
        next: (command: Command) => {
            expect((command as FollowCommand).arguments.members).toEqual(["gaspiseere", "abcd", "@qwer"]);
        }
    })
})

test('Should return follow command with empty members', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere follow");
    parser.parse().subscribe({
        next: (command: Command) => {
            expect((command as FollowCommand).arguments.members).toEqual([]);
        }
    })
})

test('Should emit error with missing argument', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere cooldown");
    parser.parse().subscribe({
        error: (error: Error) => {
            expect(error.message).toEqual(expect.stringContaining("Missing required argument: duration"));
        }
    })
})


test('Should return cooldown command with -1', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere cooldown -d -1");
    parser.parse().subscribe({
        next: (command: Command) => {
            expect((command as CooldownCommand).arguments.duration).toEqual(-1)
        }
    })
})

test('Should be NaN when duration is word', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere cooldown -d asdasdasd");
    parser.parse().subscribe({
        next: (command: Command) => {
            expect((command as CooldownCommand).arguments.duration).toBeNaN()
        }
    })
})

test('Should throw error when prefix missing', () => {
    expect(() => {
        new StringArgparser("gaiseere cooldown");
    }).toThrow();
})

test('Should emit error when no arguments', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere");
    parser.parse().subscribe({
        error: (err: Error) => {
            expect(err.message).toEqual(expect.stringContaining("got 0, need at least 1"));
        }
    })
})

test('Should emit error with unknown command', () => {
    let parser: StringArgparser = new StringArgparser('gaspiseere non-existent');
    parser.parse().subscribe({
        error: (err: Error) => {
            expect(err.message).toEqual(expect.stringContaining("Unknown argument: non-existent"));
        }
    })
})

test('Should emit error with unknown argument', () => {
    let parser: StringArgparser = new StringArgparser('gaspiseere follow -a');
    parser.parse().subscribe({
        error: (err: Error) => {
            expect(err.message).toEqual(expect.stringContaining("Unknown argument: a"));
        }
    })
})

test('Should return list command', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere list");
    let listAction: Action = "LIST_FOLLOWING"
    parser.parse().subscribe({
        error: (err: Error) => {
            fail(`Error should not be thrown ${err}`);
        },
        next: (command: Command) => {
            expect(command.actionName).toEqual(listAction);
        }
    })
})
