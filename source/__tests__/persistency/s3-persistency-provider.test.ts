import { S3PersistencyProvider } from "../../state-management/persistency/providers/s3-persistency-provider";
import { PersistencyProvider } from "../../state-management/persistency/providers/persistency-provider"

test("Should throw error if fetch was called before initialization complete", () => {
    const provider: PersistencyProvider = new S3PersistencyProvider("test", () => {});
    expect(() => {
        provider.fetch();
    }).toThrow();
});

// test("Expect fetch after update to ", (done: jest.DoneCallback) => {
//     const provider: PersistencyProvider = new S3PersistencyProvider("test2", () => {});
//     provider.updateOrCreate("asdasd");
//     expect(provider.fetch()).toEqual("asdasd");
//     done();
// });

test("Should fetch data successfully when initialized", () => {
    let provider: PersistencyProvider;
    const onInitialized = () => {
        expect(provider.fetch()).toEqual("a\n");
    }

    provider = new S3PersistencyProvider("test", onInitialized);
});
