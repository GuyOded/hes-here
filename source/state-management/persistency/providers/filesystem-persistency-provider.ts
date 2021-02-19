import { PersistencyProvider } from "./persistency-provider";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

class FileSystemPersistencyProvider implements PersistencyProvider {
    private readonly fullFilePath: string;

    constructor(fileName: string = "data", directoryPath = os.tmpdir()) {
        directoryPath = path.resolve(directoryPath);
        if (!fs.existsSync(directoryPath)) {
            throw new Error(`Provided path ${directoryPath} does not exist in the system`);
        }
        const verifiedDirPath: string = directoryPath;

        const fullFilePath: string = path.resolve(verifiedDirPath, fileName);
        if (path.dirname(fullFilePath) != verifiedDirPath) {
            throw new Error(`Traversing beyond the given directory ${verifiedDirPath} is not allowed`);
        }

        this.fullFilePath = fullFilePath;
    }

    public readonly updateOrCreate = (data: string): boolean => {
        try {
            fs.writeFileSync(this.fullFilePath, data, { flag: "w+" });
        } catch (err: unknown) {
            console.error(`Unable to update or create file: ${err}`)
            return false;
        }

        return true;
    }

    public readonly fetch = (): string => {
        let data: Buffer;
        try {
            data = fs.readFileSync(this.fullFilePath);
        } catch (err: unknown) {
            console.error(`Unable to read file: ${err}`);
            throw err;
        }

        return data.toString();
    }
}

export {
    FileSystemPersistencyProvider
}
