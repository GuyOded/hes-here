import { CooldownArgs } from "../../../commands/templates";
import { StateTemplate, UserState } from "../state-template";
import { Action, StateTemplateReducer } from "../store";

const setCooldownReducer: StateTemplateReducer = {
    reduce: (action: Action, state: StateTemplate): StateTemplate => {
        if (action.actionName != "SET_COOLDOWN") {
            return state;
        }
        const cooldownArgs: CooldownArgs = action.arguments as CooldownArgs

        let newState: StateTemplate = [...state]
        const userStateIndex: number = newState.findIndex((userState: UserState) => {
            return userState.id === action.invoker;
        });

        if (userStateIndex >= 0) {
            newState[userStateIndex].cooldown = cooldownArgs.duration;
            return newState
        }

        return newState.concat({
            id: action.invoker,
            following: [],
            cooldown: cooldownArgs.duration
        });
    }
}

export {
    setCooldownReducer
}
