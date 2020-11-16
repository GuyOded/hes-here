import { StringArgparser } from "../../commands/parser/concrete-parsers/chat-arg-parser"

test('constructor exists', () => {
    let parser: StringArgparser = new StringArgparser("help")
    parser.parse()
})