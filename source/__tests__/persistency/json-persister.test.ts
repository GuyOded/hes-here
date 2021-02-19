import { StateTemplate } from "../../state-management/plain-state/state-template";
import { JsonPersister } from "../../state-management/persistency/data-persisters/json-persister";
import { FileSystemPersistencyProvider }  from "../../state-management/persistency/providers/filesystem-persistency-provider";
import { PersistencyProvider } from "../../state-management/persistency/providers/persistency-provider";
import * as path from "path";
import * as fs from "fs";

test("JsonPersister should return app state after persist request", () => {
    const fileName = "state-gasp";
    const persistencyProvider: PersistencyProvider = new FileSystemPersistencyProvider(fileName, "./");
    const jsonPersister: JsonPersister = new JsonPersister(persistencyProvider);

    const state: StateTemplate = [
        {
            id: "asdasd",
            following: ["blabla", "blabla"],
            cooldown: 39
        },
        {
            id: "woooohooo",
            following: ["asdasd", "123123"]
        }
    ]

    const persistResult: boolean = jsonPersister.persist(state);
    expect(persistResult).toBe(true);

    const fetchedData: StateTemplate | null = jsonPersister.getData() as StateTemplate | null;
    expect(fetchedData).toBeTruthy();
    expect(fetchedData).toEqual(state);

    fs.unlinkSync(path.resolve(`./${fileName}`));
})
