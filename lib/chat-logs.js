const ChatInfo = (() => {
    const { chat } = SillyTavern.getContext();

    return {
        /**
         * Retrieves the last chat message object of a sepecified role.
         *
         * @param {[IsUser: Boolean, IsSystem: Boolean]} roleTuple - A tuple containing role states to look for.
         * @returns {ChatMessage|undefined} The last chat message object of the specified role, or undefined if not found.
         */
        getLastChatInstanceRole(roleTuple) {
            const chatClone = structuredClone(chat);

            const
                isUser = roleTuple[0],
                isSystem = roleTuple[1];

            return chatClone.findLast((msg) => {
                if (msg.is_user === isUser && msg.is_system === isSystem) {
                    return true;
                } else {
                    return false;
                }
            });
        },

        /**
         * Retrieves the last n chat message objects.
         *
         * @param {Number} n - The number of chat message objects to return.
         * @returns {ChatMessage[]} An array of retrieved chat message objects.
         */
        getLastNChatMessages(n) {
            const chatClone = structuredClone(chat);

            return chatClone.slice(-n);
        },
    };
})();

const ChatLogManipulation = {
    ChatInfo,
};

export { ChatLogManipulation };
