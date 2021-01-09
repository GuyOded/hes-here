import { EnhancedCommand, UserStateStore } from "../store";
import { BaseEnhancer } from "./base-enhancer"

class ResponseEnhancer extends BaseEnhancer {
    constructor(store: UserStateStore) {
        super(store);
    }

    public readonly dispatch = (action: EnhancedCommand): void => {
        throw new Error("Not implemented");
    }
}
