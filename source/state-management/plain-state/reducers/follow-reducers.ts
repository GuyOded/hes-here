import { FollowArgs } from "../../../commands/templates";
import { StateTemplate, UserState } from "../state-template";
import { StateTemplateReducer, EnhancedCommand } from "../store";

const followReducer: StateTemplateReducer = {
    reduce: (action: EnhancedCommand, state: StateTemplate): StateTemplate => {
        if (action.actionName != "ADD_FOLLOW") {
            return state;
        }
        const followActionArgs: FollowArgs = action.arguments as FollowArgs;
        const flattenedFollowArgs: FollowArgs = {
            ...followActionArgs,
            // TODO: Write a utility function for removing duplicates
            members: Array.from(new Set([...followActionArgs.members]))
        }

        let newState: StateTemplate = [...state];
        const userStateIndex: number = newState.findIndex((userState: UserState) => {
            return userState.id === action.invoker;
        });

        if (userStateIndex >= 0) {
            const userState: UserState = newState[userStateIndex];
            newState.splice(userStateIndex, 1);
            return newState.concat({
                ...userState,
                following: Array.from(new Set([...userState.following, ...flattenedFollowArgs.members]))
            });
        }

        return newState.concat({
            id: action.invoker,
            following: flattenedFollowArgs.members
        });
    }
}

export {
    followReducer
}
