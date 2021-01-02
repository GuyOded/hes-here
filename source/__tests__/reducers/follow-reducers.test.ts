import * as FollowReducers from "../../state-management/plain-state/reducers/follow-reducers";
import { StateTemplate } from "../../state-management/plain-state/state-template";
import { FollowArgs } from  "../../commands/templates";

/**
 * All tests assume that the input members should be in lower case
 */

test("Empty state should contain 1 element after reduce", () => {
    const state: StateTemplate = []
    const actionArgs: FollowArgs = {
        members: ["asasd", "asdasd"]
    }

    const newState: StateTemplate = FollowReducers.followReducer.reduce({
        invoker: "asdasd",
        actionName: "ADD_FOLLOW",
        arguments: actionArgs
    }, state)

    const expectedState: StateTemplate = [
        {
            id: "asdasd",
            following: ["asasd", "asdasd"]
        }
    ];
    expect(newState).toEqual(expectedState);
});

test("Member that is already followed should not be added", () => {
    const state: StateTemplate = [{
        id: "me",
        following: ["roynecro"],
        cooldown: 2
    }]

    const newState: StateTemplate = FollowReducers.followReducer.reduce({
        invoker: "me",
        actionName: "ADD_FOLLOW",
        arguments: {
            members: ["roynecro", "roynecro"]
        } as FollowArgs
    }, state);

    expect(newState).toEqual(state);
});

test("Member that has been specified multiple times should only be added once", () => {
    const state: StateTemplate = [];

    const newState: StateTemplate = FollowReducers.followReducer.reduce({
        invoker: "me",
        actionName: "ADD_FOLLOW",
        arguments: {
            members: ["roynecro", "roynecro"]
        } as FollowArgs
    }, state);

    const expectedState: StateTemplate = [
        {
            id: "me",
            following: ["roynecro"]
        }
    ];
    expect(newState).toEqual(expectedState);
});
