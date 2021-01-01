export const config: Config = {
    serverName: "Heroes Defence Force",
    notificationCooldown: 30,
    notificationMapping: [
        // {
        //     notifyee: "roynecro",
        //     notifyOnOnlinePresence: ["guy", "HolyHuly", "JoKeR"]
        // },
        // {
        //     notifyee: "guy",
        //     notifyOnOnlinePresence: ["roynecro", "guy", "Archaru"]
        // },
        // {
        //     notifyee: "Archaru",
        //     notifyOnOnlinePresence: ["SleepyBearer"]
        // },
        // {
        //     notifyee: "SleepyBearer",
        //     notifyOnOnlinePresence: ["Archaru"]
        // },
        // {
        //     notifyee: "JoKeR",
        //     notifyOnOnlinePresence: ["roynecro"]
        // },
        // {
        //     notifyee: "HolyHuly",
        //     notifyOnOnlinePresence: ["roynecro", "SleepyBearer", "Archaru", "SkillCoterie"]
        // }
    ],
    permitChatCLI: [
        "guy",
        "roynecro"
    ]
}

export interface Config {
    serverName: string;
    notificationCooldown: number;
    notificationMapping: NotificationMapping[];
    permitChatCLI: string[];
}
export interface NotificationMapping {
    notifyee: string;
    notifyOnOnlinePresence: string[];
}