import { Guild, GuildMember } from "discord.js";
import { config } from "../../../configuration/app-config";
import { UserState } from "../state-template";
import { EnhancedCommand, UserStateStore } from "../store";
import { BaseEnhancer } from "./base-enhancer";

class ResponseEnhancer extends BaseEnhancer {
    private readonly guild: Guild;

    constructor(store: UserStateStore, guild: Guild) {
        super(store);
        this.guild = guild;
    }

    public readonly dispatch = (action: EnhancedCommand): void => {
        if (action.actionName === "LIST_FOLLOWING") {
            const guildMember: GuildMember | null = this.getGuildMemberFromSnowflake(action.invoker);
            if (!guildMember) {
                console.error(`Received action ${action} where the executer cannot be found in guild ${this.guild.name}`);
                return;
            }

            const state: UserState | null = this.getUserState(action.invoker);
            if (!state) {
                // TODO: Add tagged templates
                guildMember.send(`Following: -\nCooldown: \u221E`);
            } else {
                guildMember.send(`Following: ${state.following}\nCooldown: ${state.cooldown ? state.cooldown : config.notificationCooldown}`);
            }
        }

        this.store.dispatch(action);
        return;
    }

    // TODO: Create discord utils!!!!!!
    private readonly getGuildMemberFromSnowflake = (invoker: string): GuildMember | null => {
        const member: GuildMember | undefined = this.guild.members.cache.find((member: GuildMember) => {
            return member.id === invoker;
        })
        return member ? member : null;
    }

    // TODO: Selectors?
    private readonly getUserState = (invoker: string): UserState | null => {
        const userState: UserState | undefined = this.store.getState().find((state: UserState) => {
            return state.id === invoker;
        })

        return userState ? userState : null;
    }
}

export {
    ResponseEnhancer
}
