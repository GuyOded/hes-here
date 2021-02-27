import { Client, Intents } from "discord.js";
import auth from "./configuration/auth";
import { ApplicationStarter } from "./state-management/application-starter";
import { S3PersistencyProviderBuilder } from "./state-management/persistency/providers/builders";
import { S3PersistencyProvider } from "./state-management/persistency/providers/s3-persistency-provider";

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
    const builder: S3PersistencyProviderBuilder = new S3PersistencyProviderBuilder("gaspiseere-state");
    builder.build().then((persistencyProvider: S3PersistencyProvider) => {
        const appStarter: ApplicationStarter = new ApplicationStarter(client, persistencyProvider);
        appStarter.run();
    });
})
