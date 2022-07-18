import chalk from "chalk"

export default class Logger {

    static log(content: string, type = "log") {
        const timestamp = `[${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}]:`;
        switch (type) {
            case "log": {
                return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
            }

            case "warn": {
                return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
            }

            case "error": {
                return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
            }

            case "debug": {
                return console.log(`${timestamp} ${chalk.yellow.bgBlue(type.toUpperCase())} ${content} `);
            }

            case "cmd": {
                return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
            }

            case "ready": {
                return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
            }

            default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
        }
    }

    static error(content: string) {
        return this.log(content, "error");
    }

    static ready(content: string) {
        return this.log(content, "ready")
    }

    static warn(content: string) {
        return this.log(content, "warn");
    }

    static debug(content: string) {
        return this.log(content, "debug");
    }

    static cmd(content: string) {
        return this.log(content, "cmd");
    }
}