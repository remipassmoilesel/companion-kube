import {ILogLevel, LogLevels} from './LogLevels';

const chalk = require('chalk');

interface ILoggerOptions {
    namespace: string;
    logLevel: ILogLevel;
}

export class Logger {
    private static defaultLogLevel: ILogLevel = LogLevels.info;

    public static setDefaultLogLevel(iLogLevel: ILogLevel) {
        this.defaultLogLevel = iLogLevel;
    }

    public static getDefaultOptions(): ILoggerOptions {
        return {namespace: 'main', logLevel: this.defaultLogLevel};
    }

    private options: ILoggerOptions;

    constructor(options: ILoggerOptions = Logger.getDefaultOptions()) {
        this.options = options;
    }

    public title(message: string, level = LogLevels.info) {
        const line = Array(message.length + 1).join('=');
        this.printColor(level, line);
        this.printColor(level, message);
        this.printColor(level, line);
    }

    public debug(message?: string, data?: any) {
        this.printColor(LogLevels.debug, message, data);
    }

    public info(message?: string, data?: any) {
        this.printColor(LogLevels.info, message, data);
    }

    public success(message?: string, data?: any) {
        this.printColor(LogLevels.success, message, data);
    }

    public warning(message?: string, data?: any) {
        this.printColor(LogLevels.warning, message, data);
    }

    public error(message?: string, data?: any) {
        this.printColor(LogLevels.error, message, data);
    }

    public question(message?: string, data?: any) {
        this.printColor(LogLevels.question, message, data);
    }

    public printColor(level: ILogLevel, message?: string, data?: any) {

        if (level.value < this.options.logLevel.value) {
            return;
        }

        if (!message) {
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
