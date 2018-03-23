const chalk = require('chalk');

interface ILogLevel {
    color: string;
    mark: string;
}

class LogLevels {
    public static success: ILogLevel = {
        color: 'green',
        mark: '[✓]',
    };
    public static info: ILogLevel = {
        color: 'cyan',
        mark: '[ℹ]',
    };
    public static warning: ILogLevel = {
        color: 'yellow',
        mark: '[⚠]',
    };
    public static error: ILogLevel = {
        color: 'yellow',
        mark: '[!]',
    };
}

export function title(message: string, level = LogLevels.info) {
    const line = Array(message.length + 1).join('=');
    printColor(level, line);
    printColor(level, message);
    printColor(level, line);
}

export function success(message?: string, data?: any) {
    printColor(LogLevels.success, message, data);
}

export function info(message?: string, data?: any) {
    printColor(LogLevels.info, message, data);
}

export function warning(message?: string, data?: any) {
    printColor(LogLevels.warning, message, data);
}

export function error(message?: string, data?: any) {
    printColor(LogLevels.error, message, data);
}

export function printColor(level: ILogLevel, message?: string, data?: any) {

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
