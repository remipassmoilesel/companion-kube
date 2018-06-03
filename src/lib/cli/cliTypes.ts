
export interface ICliForceEnvOptions {
    f?: boolean;
    force?: boolean;
}

export interface ICliEnvOptions {
    e?: string;
    environment?: string;
}

export interface ICliApplicationsArguments extends ICliEnvOptions {
    remainingArguments: string[]; // Application names
}

export interface ICliRunArguments extends ICliEnvOptions {
    remainingArguments: string[]; // Script name then arguments. Example: ck run dashboard --gui
}
