import { User, Message } from "discord.js"

export const permittedUsers = (message: Message, permittedUser: User): boolean => {
    return permittedUser.id === message.author.id;
}
