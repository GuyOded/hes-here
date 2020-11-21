import { ArgumentError } from "argparse"
import { StringArgparser } from "../../commands/parser/concrete-parsers/chat-arg-parser"

test('bad argument', () => {
    let parser: StringArgparser = new StringArgparser("help")
    parser.parse().subscribe({
        next: (command: any) => {
            console.log(command)
        },
        error: (err: any) => {
            if (err instanceof ArgumentError) {
                console.log(err.str())
            }
        }
    })
})

/* test('valid argument', () => {
    let parser: StringArgparser = new StringArgparser("--help")
    parser.parse().subscribe({
        next: (command: any) => {
            console.log(command)
        }
    })
}) */