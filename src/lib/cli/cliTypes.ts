import {ILogLevel, LogLevels} from '../misc/LogLevels';

export interface IInitOptions {
    f: boolean;
}

export interface IRunArguments {
    script: string;
}

export interface IDeployArguments {
    applications: string[];
}

export interface IDeployOptions {
    e?: string;
}

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

    public static CLEAN: ICliOperation = {
        name: 'CLEAN',
        level: LogLevels.error,
    };
}

