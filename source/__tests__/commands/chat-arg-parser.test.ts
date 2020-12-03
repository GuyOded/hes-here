import { availableCommands, FollowCommand } from "../../commands/templates"
import { StringArgparser } from "../../commands/parser/concrete-parsers/string-parser/string-parser"
import { Command } from "../../commands/command"

test('test general help message', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere help")
    let error: string = ""
    parser.parse().subscribe({
        next: (command: any) => {
            console.log(command)
        },
        error: (err: Error) => {
            error = err.message
        }
    })
    expect(error).toEqual(expect.stringContaining(availableCommands.SET_COOLDOWN.name))
    expect(error).toEqual(expect.stringContaining(availableCommands.SET_NOTIFICATION_LIST.name))
})

test('test follow command help message', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere cooldown --help");
    let error: string = "";
    parser.parse().subscribe({
        next: (command: any) => {
            console.log(command);
        },
        error: (err: Error) => {
            error = err.message;
        }
    })
    expect(error).toEqual(expect.stringContaining("-d"));
    expect(error).toEqual(expect.stringContaining("--duration"));
})

test('test follow command help message', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere follow --help");
    parser.parse().subscribe({
        next: (command: any) => {
            console.log(command);
        },
        error: (err: Error) => {
            expect(err.message).toEqual(expect.stringContaining("-m"))
            expect(err.message).toEqual(expect.stringContaining("--members"))
        }
    })
})

test('should return follow command', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere follow --members gaspiseere abcd @qwer");
    parser.parse().subscribe({
        next: (command: Command) => {
            expect((command as FollowCommand).arguments.members).toEqual(["gaspiseere", "abcd", "@qwer"]);
        }
    })
})

test('should return follow command with empty members', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere follow");
    parser.parse().subscribe({
        next: (command: Command) => {
            expect((command as FollowCommand).arguments.members).toEqual([]);
        }
    })
})

test('should return cooldown command with 30', () => {
    let parser: StringArgparser = new StringArgparser("gaspiseere cooldown");
    parser.parse().subscribe({
        next: (command: Command) => {
            
        },
        error: (error: Error) => {
            expect(error.message).toEqual(expect.stringContaining("Missing required argument: duration"));
            
        }
    })
})

test('should throw error "prefix missing"', () => {
    expect(() => {
        new StringArgparser("gaiseere cooldown");
    }).toThrow();
})
