import { Snowflake } from "discord.js";

/////////////////////////
////// Interfaces ///////
/////////////////////////

/**
 * Template in the sense that the actual application state defined in @see AppState
 * is built accordingly with this state. Every logical operation regarding application state
 * is performed on this object using the redux pattern and then translated by a builder to app state.
 */
type StateTemplate = UserState[];

interface UserState {
    id: Snowflake;
    cooldown: number;
    following: string[];
}

export {
    StateTemplate,
    UserState
}
