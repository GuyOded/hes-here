import { Client, Intents } from "discord.js";
import auth from "./configuration/auth";
import { ApplicationStarter } from "./state-management/application-starter";

const client = new Client({
    ws: {
        intents: [Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES]
    }
});

if (!auth.token) {
    throw new Error("Unable to read security token...");
}
client.login(auth.token).catch((reason: any) => {
    console.error("Unable to login to discord...");
    throw new Error(reason);
})

client.once("ready", () => {
    const appStarter: ApplicationStarter = new ApplicationStarter(client)
    appStarter.run()
})
