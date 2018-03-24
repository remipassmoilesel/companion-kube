const chalk = require('chalk');

interface ILogLevel {
    color: string;
    mark: string;
    value: number;
}

export class LogLevels {
    public static info: ILogLevel = {
        color: 'cyan',
        mark: '[ℹ]',
        value: 0,
    };
    public static success: ILogLevel = {
        color: 'green',
        mark: '[✓]',
        value: 1,
    };
    public static warning: ILogLevel = {
        color: 'yellow',
        mark: '[⚠]',
        value: 2,
    };
    public static error: ILogLevel = {
        color: 'yellow',
        mark: '[!]',
        value: 3,
    };
}

interface ILoggerOptions {
    namespace: string;
    logLevel: ILogLevel;
}

export class Logger {
    private options: ILoggerOptions;

    constructor(options: ILoggerOptions){
        this.options = options;
    }

    public title(message: string, level = LogLevels.info) {
        const line = Array(message.length + 1).join('=');
        this.printColor(level, line);
        this.printColor(level, message);
        this.printColor(level, line);
    }

    public success(message?: string, data?: any) {
        this.printColor(LogLevels.success, message, data);
    }

    public info(message?: string, data?: any) {
        this.printColor(LogLevels.info, message, data);
    }

    public warning(message?: string, data?: any) {
        this.printColor(LogLevels.warning, message, data);
    }

    public error(message?: string, data?: any) {
        this.printColor(LogLevels.error, message, data);
    }

    public printColor(level: ILogLevel, message?: string, data?: any) {

        if (level.value < this.options.logLevel.value){
            return;
        }

        if (!message){
            console.log();
            return;
        }

        const colorFunc = chalk[level.color];
        console.log(colorFunc(`${level.mark} ${message || ''}`));
        if (data) {
            console.log(data);
        }
    }

}
