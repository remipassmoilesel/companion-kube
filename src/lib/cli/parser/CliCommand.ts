import {CliOption} from './CliOption';

export type CommandHandler = (command: CliCommand, parsedArgs: IParsedArguments) => Promise<void>;

export interface IParsedArguments {
    remainingArguments: string[];
    [x: string]: any;
}

export class CliCommand {
    public command: string;
    public handler: CommandHandler;
    public options: CliOption[] = [];
    public description: string;
    public commandArray: string[];

    constructor(command: string, description: string, handler: CommandHandler) {
        this.command = command;
        this.handler = handler;
        this.description = description;
        this.commandArray = command.split(' ');
    }

    public addOption(option: CliOption): CliCommand {
        this.options.push(option);
        return this;
    }
}
