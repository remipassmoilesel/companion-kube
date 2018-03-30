import {ILogLevel, LogLevels} from '../misc/LogLevels';


export interface ICliOperation {
    name: string;
    level: ILogLevel;
}

export class CliOperations {

    public static DEPLOY: ICliOperation = {
        name: 'DEPLOY',
        level: LogLevels.info,
    };

    public static BUILD: ICliOperation = {
        name: 'BUILD',
        level: LogLevels.info,
    };

    public static REDEPLOY: ICliOperation = {
        name: 'REDEPLOY',
        level: LogLevels.warning,
    };

    public static DESTROY: ICliOperation = {
        name: 'DESTROY',
        level: LogLevels.error,
    };
}

