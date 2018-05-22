import {ILogLevel, LogLevels} from '../log/LogLevels';

export interface IInitOptions {
    f: boolean;
}

export interface IRunArguments {
    script: string[];
}

export interface IApplicationArguments {
    applications: string[];
}

export interface IEnvironmentOptions {
    e?: string;
}

export interface IEnvironmentArguments {
    env: string;
}