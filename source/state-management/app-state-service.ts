import { User } from "discord.js";
import { subscribePresenceObservers } from "../observers/observers-creation";
import AppState from "./app-state";
import { Observable, Subscription } from "rxjs"
import { PresenceDisplacement } from "../observers/presence-observer"
import { config } from "../configuration/config"

// interface StateBuilder {
//     destroy(): void;
// }
// TODO: Think of a more appropriate name
class AppStateService {
    private readonly appState: AppState
    // TODO: Change name to plainState when the redux infrastructure is done
    // constructor(reduxState: unknown) {
    //     // Create observers based on state
    // }
    // Temporary constructor (a shame there isn't constructor overloading)
    constructor(notificationMapping: Map<User, User[]>, observable: Observable<PresenceDisplacement>) {
        this.appState = {
            presenceObserversSubscriptions: subscribePresenceObservers(notificationMapping, observable, config.notificationCooldown)
        }
    }

    public readonly destroy = (): void => {
        this.appState.presenceObserversSubscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        })
    }
}

export {
    AppStateService
}
