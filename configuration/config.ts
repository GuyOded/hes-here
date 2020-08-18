export const config: Config = {
    serverName: "Heroes Defence Force",
    notificationMapping: [
    {
        notifyee: "roynecro",
        notifyOnOnlinePresence: ["guy", "HolyHuly", "JoKeR"]
    },
    {
        notifyee: "guy",
        notifyOnOnlinePresence: ["roynecro", "guy", "Archaru"]
    },
    {
        notifyee: "Archaru",
        notifyOnOnlinePresence: ["SleepyBearer"]
    },
    {
        notifyee: "SleepyBearer",
        notifyOnOnlinePresence: ["Archaru"]
    },
    {
        notifyee: "JoKeR",
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