import * as FollowReducers from "../../state-management/plain-state/reducers/follow-reducers";
import { StateTemplate } from "../../state-management/plain-state/state-template";
import { FollowArgs, UnfollowArgs } from  "../../commands/templates";

/**
 * All tests assume that the input members should be in lower case
 */

////////////
// Follow //
////////////
test("Empty state should contain 1 element after reduce", () => {
    const state: StateTemplate = [];
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

//////////////
// Unfollow //
//////////////
test("Unfollow user that is followed should remove the user", () => {
    const state: StateTemplate = [
        {
            id: "me",
            following: ["roynecro"]
        }
    ];

    const newState: StateTemplate = FollowReducers.unfollowReducer.reduce({
        invoker: "me",
        actionName: "REMOVE_FOLLOW",
        arguments: {
            members: ["roynecro"]
        } as UnfollowArgs
    }, state);

    const expectedState: StateTemplate = [
        {
            id: "me",
            following: []
        }
    ];

    expect(newState).toEqual(expectedState);
});

// Not a really necessary state as the verifier already sifts this edge case
test("Unfollow when the user has no state should return the current state", () => {
    const state: StateTemplate = [
        {
            id: "me",
            following: ["roynecro"]
        }
    ];

    const newState: StateTemplate = FollowReducers.unfollowReducer.reduce({
        invoker: "dude",
        actionName: "REMOVE_FOLLOW",
        arguments: {
            members: ["roynecro"]
        } as UnfollowArgs
    }, state);

    expect(newState).toEqual(state);
});

// This case should also be covered by the corresponding verifier
test("Unfollow user that is not followed should return the state with the follow list unchanged", () => {
    const state: StateTemplate = [
        {
            id: "me",
            following: ["roynecro"]
        }
    ];

    const newState: StateTemplate = FollowReducers.unfollowReducer.reduce({
        invoker: "me",
        actionName: "REMOVE_FOLLOW",
        arguments: {
            members: ["userdave"]
        } as UnfollowArgs
    }, state);

    expect(newState).toEqual(state);
});
