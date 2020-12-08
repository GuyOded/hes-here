import { Subscription } from "rxjs"

// TODO: Think of a more appropriate name
export default interface ComplxState {
    presenceObserversSubscriptions: Subscription[]
}
