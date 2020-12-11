import { FollowArgs } from "../../../commands/templates";
import { StateTemplate, UserState } from "../state-template";
import { StateTemplateReducer, Action } from "../store";

const followReducer: StateTemplateReducer = {
    reduce: (action: Action, state: StateTemplate): StateTemplate => {
        if (action.actionName != "ADD_FOLLOW") {
            return state;
        }
        const followArgs: FollowArgs = action.arguments as FollowArgs;

        return state.map<UserState>((userState: UserState): UserState => {
            if (userState.id === action.invoker) {
                userState.following.push(...followArgs.members);
            }

            return userState;
        })
    }
}
