import { PersistencyProvider } from "./persistency-provider";

class S3PersistencyProvider implements PersistencyProvider {
    public readonly updateOrCreate = (data: string): boolean => {
        throw new Error("Not implemented");
    }

    public readonly fetch = (): string => {
        throw new Error("Not implemented");
    }
}
