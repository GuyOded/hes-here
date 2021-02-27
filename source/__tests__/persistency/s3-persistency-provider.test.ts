import { S3PersistencyProvider } from "../../state-management/persistency/providers/s3-persistency-provider";
import { PersistencyProvider } from "../../state-management/persistency/providers/persistency-provider"

test("Should throw error if fetch was called before initialization complete", () => {
    const provider: PersistencyProvider = new S3PersistencyProvider("test");
    expect(() => {
        provider.fetch();
    }).toThrow();
});
