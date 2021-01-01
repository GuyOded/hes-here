import { Subscription } from "rxjs";
import AppState from "./app-state";

// interface StateBuilder {
//     destroy(): void;
// }
// TODO: Think of a more appropriate name
class AppStateService {
    private readonly appState: AppState
    constructor(appState: AppState) {
        this.appState = appState;
    }

    public readonly destroy = (): void => {
        this.appState.presenceObserversSubscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        })
    }
}

export {
    AppStateService
};

