import { Subscription } from "rxjs"

// TODO: Think of a more appropriate name
/**
 * Represents the state of the application that is mutated by user commands in the course of a run.
 * This state is created by the state-builder given the current redux state of the application.
 * In a sense this state can be paralleled to the state of the GUI in a classic redux GUI application.
 * This state should be persisted when it is changed.
 */
export default interface AppState {
    presenceObserversSubscriptions: Subscription[]
}
