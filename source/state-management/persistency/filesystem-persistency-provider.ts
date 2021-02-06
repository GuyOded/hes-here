import { PersistencyProvider } from "./persistency-provider";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

class FileSystemPersistencyProvider implements PersistencyProvider {
    private readonly fullFilePath: string;

    constructor(fileName: string, directoryPath = os.tmpdir()) {
        if (!fs.existsSync(directoryPath)) {
            throw new Error(`Provided path ${directoryPath} does not exist in the system`);
        }
        const verifiedDirPath: string = directoryPath;

        // TODO: This class is not going to be used but maybe solve path traversal issues?
        this.fullFilePath = path.resolve(verifiedDirPath, fileName);
    }

    public readonly updateOrCreate = (data: string): boolean => {
        try {
            fs.writeFileSync(this.fullFilePath, data, "w+");
        } catch (err: unknown) {
            console.error(`Unable to update or create persistent object: ${err}`)
            return false;
        }

        return true;
    }

    public readonly fetch = (): string => {
        return "";
    }
}
