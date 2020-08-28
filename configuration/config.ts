export const config: Config = {
    serverName: "Heroes Defence Force",
    notificationCooldown: 30,
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
    },
    {
        notifyee: "HolyHuly",
        notifyOnOnlinePresence: ["roynecro", "SleepyBearer", "Archaru", "SkillCoterie"]
    }]
}

export interface Config {
    serverName: string;
    notificationCooldown: number;
    notificationMapping: NotificationMapping[];
}
export interface NotificationMapping {
    notifyee: string;
    notifyOnOnlinePresence: string[];
}