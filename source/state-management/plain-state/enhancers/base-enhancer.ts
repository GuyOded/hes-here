import { CommandStore, EnhancedCommand, UserStateStore  } from "../store";
import { StateTemplate } from "../state-template";


/**
 * Basically a default decorator for command store. This class exists for other concrete enhancers to override one of the
 * exported functions as they need. In addition to repsceting the redux pattern this class is  a good design choice in general,
 * because it lets you perform an additional action when dispatching an action and keep the implementation of store simple without
 * any changes to the class.
 */
abstract class BaseEnhancer implements CommandStore<StateTemplate> {
    protected readonly store: UserStateStore;

    constructor(store: UserStateStore) {
        this.store = store;
    }

    public readonly dispatch = (action: EnhancedCommand): void => {
        this.store.dispatch(action);
    }

    public readonly getState = (): StateTemplate => {
        return this.store.getState();
    }
}

export {
    BaseEnhancer
}
