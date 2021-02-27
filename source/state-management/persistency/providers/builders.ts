import { S3PersistencyProvider } from "./s3-persistency-provider";

interface Builder<T> {
    build: () => T;
}

/**
 * As S3PersistencyProvider is initialized asynchronously this builder is used and returns a promise instead
 * of directly returning the provider.
 * 
 * The provider is ready to be used once the promise is fullfiled.
 */
class S3PersistencyProviderBuilder implements Builder<Promise<S3PersistencyProvider>> {
    private keyName: string;

    constructor(keyName: string) {
        this.keyName = keyName;
    }

    public setKeyname = (keyName: string): void => {
        keyName = keyName;
    }

    public readonly build: () => Promise<S3PersistencyProvider> = () => {
        const persistencyProvider: S3PersistencyProvider = new S3PersistencyProvider(this.keyName);
        return persistencyProvider.initializeCache()
        .then(() => {
            return persistencyProvider;
        })
        .catch((error: unknown) => {
            throw error;
        });
    }
}

export {
    Builder,
    S3PersistencyProviderBuilder
}
