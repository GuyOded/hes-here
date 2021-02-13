import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as crypto from "crypto";

const removeFilesFromTmpdir = (tempFilesName: string[]): void => {
    tempFilesName.forEach((fileName) => {
        const tempfilePath = path.resolve(os.tmpdir(), fileName);
        fs.unlinkSync(tempfilePath);
    })
}

const generateTempFileName = (): string => {
    const LENGTH = 15;
    const randomBuffer: Buffer = crypto.randomBytes(LENGTH);

    return randomBuffer.toString("base64");
}

export {
    removeFilesFromTmpdir,
    generateTempFileName
}
