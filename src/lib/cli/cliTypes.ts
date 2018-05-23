export interface ICliBaseArguments {
    f: boolean;
    force: boolean;
    e: string;
    environment: string;
}

export interface ICliApplicationsArguments extends ICliBaseArguments{
    applications: string[];
}

export interface ICliRunArguments extends ICliBaseArguments{
    script: string[]; // Script name then arguments. Example: ck run dashboard --gui
}
