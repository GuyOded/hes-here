export const config: Config = {
    serverName: "Heroes Defence Force",
    notificationMapping: [
    {
        notifyee: "roynecro",
        notifyOnOnlinePresence: ["guy"]
    },
    {
        notifyee: "guy",
        notifyOnOnlinePresence: ["roynecro"]
    }]
}

export interface Config {
    serverName: string;
    notificationMapping: NotificationMapping[];
}
export interface NotificationMapping {
    notifyee: string;
    notifyOnOnlinePresence: string[];
}