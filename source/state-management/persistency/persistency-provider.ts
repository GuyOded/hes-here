interface PersistencyProvider {
    updateOrCreate: (data: string) => boolean;
    fetch: () => string;
}

export {
    PersistencyProvider
}
