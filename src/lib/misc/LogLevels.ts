
export interface ILogLevel {
    color: string;
    mark: string;
    value: number;
}

export class LogLevels {
    public static debug: ILogLevel = {
        color: 'white',
        mark: '[.]',
        value: -1,
    };
    public static info: ILogLevel = {
        color: 'cyan',
        mark: '[~]',
        value: 0,
    };
    public static success: ILogLevel = {
        color: 'green',
        mark: '[+]',
        value: 1,
    };
    public static warning: ILogLevel = {
        color: 'yellow',
        mark: '[!]',
        value: 2,
    };
    public static error: ILogLevel = {
        color: 'redBright',
        mark: '[!]',
        value: 3,
    };
}
