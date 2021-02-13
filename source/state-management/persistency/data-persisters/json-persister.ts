import { PersistencyProvider } from "../providers/persistency-provider";

class JsonPersister {
    private readonly persistencyProvider: PersistencyProvider;

    constructor(persistencyProvider: PersistencyProvider) {
        this.persistencyProvider = persistencyProvider;
    }

    public readonly persist = (data: Object): boolean => {
        return this.persistencyProvider.updateOrCreate(JSON.stringify(data));
    }

    public readonly getData = (): Object | null => {
        let data: Object;

        try {
            data = JSON.parse(this.persistencyProvider.fetch());
        } catch (err: unknown) {
            console.error(`Unable to parse or retrieve data: ${err}`);
            return null;
        }

        return data;
    }
}

export {
    JsonPersister
}
