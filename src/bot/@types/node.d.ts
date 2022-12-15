declare namespace NodeJS {
    interface ProcessEnv {
        /**
         *  The token of the Discord bot
         */
        BOT_TOKEN: string;
        /**
         * The URL of the PostgreSQL database
         */
        DATABASE_URL: string;
        /**
         * The URL of the webhook to send the server logs to
         */
        SERVERLOGS_WEBHOOK?: string;
        /**
         * The URL of the webhook to send the commands logs to
         */
        COMMANDSLOGS_WEBHOOK?: string;
    }
}
