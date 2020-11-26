import { availableCommands } from "../../commands/templates"
import { StringArgparser } from "../../commands/parser/concrete-parsers/chat-arg-parser"

test('test general help message', () => {
    let parser: StringArgparser = new StringArgparser("help")
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
    let parser: StringArgparser = new StringArgparser("cooldown --help")
    let error: string = ""
    parser.parse().subscribe({
        next: (command: any) => {
            console.log(command)
        },
        error: (err: Error) => {
            error = err.message
        }
    })
    expect(error).toEqual(expect.stringContaining("-d"))
    expect(error).toEqual(expect.stringContaining("--duration"))
})