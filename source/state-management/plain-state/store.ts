import { Snowflake } from "discord.js";
import { Command } from "../../commands/command"
import { StateTemplate } from "./state-template";

interface CommandStore<T> {
    dispatch(action: Action): void;
    getState(): T;
}

interface CommandReducer<T> {
    reduce(action: Action, state: T): T;
}

type Action = Command & { invoker: Snowflake }
type Listener = (state: StateTemplate) => unknown;
type StateTemplateReducer = CommandReducer<StateTemplate>;

// Store specification used for the app state
class UserStateStore implements CommandStore<StateTemplate> {
    private static readonly DEFAULT_PASSING_LISTENER: Listener = () => { };

    private state: StateTemplate;
    private readonly reducers: StateTemplateReducer[];
    /** For reducing general overcomplication in the future, this class dictates that only a single listener
     *  should get notified when an action is dispatched - as if to recommend that the app's state should be managed
     *  from a sole place and not multiple.
     */
    private readonly listener: Listener;

    constructor(reducers: StateTemplateReducer[],
        state: StateTemplate = [],
        listener: Listener = UserStateStore.DEFAULT_PASSING_LISTENER) {
        this.state = state;
        this.reducers = reducers;
        this.listener = listener;
    }

    dispatch(action: Action): void {
        this.state = this.reducers.reduce<StateTemplate>((previousState: StateTemplate, currentReducer: StateTemplateReducer) => {
            return currentReducer.reduce(action, previousState);
        }, this.state);
        this.listener({ ...this.state });
    }

    getState(): StateTemplate {
        return this.state;
    }
}

export {
    UserStateStore as AppCommandStore,
    Listener,
    StateTemplateReducer,
    Action
}
