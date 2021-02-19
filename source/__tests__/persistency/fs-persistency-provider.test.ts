import { FileSystemPersistencyProvider }  from "../../state-management/persistency/providers/filesystem-persistency-provider";
import { PersistencyProvider } from "../../state-management/persistency/providers/persistency-provider";
import * as fsUtils from "../../utility/fs-utils";
import * as fs from "fs";

const tempFiles: string[] = [];

test("FileSystemPersistencyProvider should create file if non-existent", () => {
    const persistencyProvider: PersistencyProvider = new FileSystemPersistencyProvider("a.txt");
    const result = persistencyProvider.updateOrCreate("asdasdasd");

    expect(result).toBe(true);
    fs.stat("/tmp/a.txt", (err, stats) => {
        expect(err).toBeFalsy();
        expect(stats.isFile()).toBe(true);
    })
})

test("FileSystemPersistencyProvider should fetch correct data", () => {
    const tempFileName = fsUtils.generateTempFileName();
    tempFiles.push(tempFileName);

    const persistencyProvider: PersistencyProvider = new FileSystemPersistencyProvider(tempFileName);
    const success = persistencyProvider.updateOrCreate("asdasd");
    const data = persistencyProvider.fetch();
    
    expect(success).toBe(true);
    expect(data).toEqual("asdasd");
})

test("Old data should be truncated by persistency provider", () => {
    const tempFileName = fsUtils.generateTempFileName();
    tempFiles.push(tempFileName);

    const persistencyProvider: PersistencyProvider = new FileSystemPersistencyProvider(tempFileName);
    let success = persistencyProvider.updateOrCreate("asdasd");
    success = success && persistencyProvider.updateOrCreate("123");
    const data = persistencyProvider.fetch();
    
    expect(success).toBe(true);
    expect(data).toEqual("123");
})

afterAll(() => {
    console.debug(`Removing: ${tempFiles}`);
    fsUtils.removeFilesFromTmpdir(tempFiles);
})
