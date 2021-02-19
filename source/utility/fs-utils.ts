import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as crypto from "crypto";
import { Readable } from "stream";
import { Observable, Subscriber } from "rxjs";

const removeFilesFromTmpdir = (tempFilesName: string[]): void => {
    tempFilesName.forEach((fileName) => {
        const tempfilePath = path.resolve(os.tmpdir(), fileName);
        fs.unlinkSync(tempfilePath);
    })
}

const generateTempFileName = (): string => {
    const LENGTH = 15;
    const randomBuffer: Buffer = crypto.randomBytes(LENGTH);

    return randomBuffer.toString("base64").replace(/\//gi, "");
}

const streamToString = (stream: Readable): Observable<string> => {
    return new Observable((subscriber: Subscriber<string>) => {
        const chunks: any[] = [];

        stream.on("data", (chunk: any) => {
            chunks.push(chunk);
        });

        stream.on("end", () => {
            const result: string = Buffer.concat(chunks).toString();
            subscriber.next(result);
            subscriber.complete();
        });
    });
}

export {
    removeFilesFromTmpdir,
    generateTempFileName,
    streamToString
}
