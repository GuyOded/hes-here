import { Action } from "../../state-management/plain-state/store";
import { CooldownArgs } from "../../commands/templates";
import { StateTemplate } from "../../state-management/plain-state/state-template";
import * as CooldownReducers from "../../state-management/plain-state/reducers/cooldown-reducers";

test("Should add new user state if the user never sent command", () => {
    const state: StateTemplate = [];
    const cooldownArgs: CooldownArgs = {
        duration: 7
    }

    const action: Action = {
        invoker: "me",
        actionName: "SET_COOLDOWN",
        arguments: cooldownArgs
    }

    const result: StateTemplate = CooldownReducers.setCooldownReducer.reduce(action, state);
    const expectedState: StateTemplate = [{
        id: "me",
        following: [],
        cooldown: 7
    }];

    expect(result).toEqual(expectedState);
});

test("Should change cooldown if user already had a state", () => {
    const state: StateTemplate = [{
        id: "me",
        following: [],
        cooldown: 3
    }];
    const cooldownArgs: CooldownArgs = {
        duration: 7
    }

    const action: Action = {
        invoker: "me",
        actionName: "SET_COOLDOWN",
        arguments: cooldownArgs
    }

    const result: StateTemplate = CooldownReducers.setCooldownReducer.reduce(action, state);
    const expectedState: StateTemplate = [{
        id: "me",
        following: [],
        cooldown: 7
    }];

    expect(result).toEqual(expectedState);
});

test("Should do nothing if action name is not SET_COOLDOWN", () => {
    const state: StateTemplate = [];
    const cooldownArgs: CooldownArgs = {
        duration: 7
    }

    const action: Action = {
        invoker: "me",
        actionName: "ADD_FOLLOW",
        arguments: cooldownArgs
    }

    const result: StateTemplate = CooldownReducers.setCooldownReducer.reduce(action, state);
    const expectedState: StateTemplate = [];

    expect(result).toEqual(expectedState);
});
