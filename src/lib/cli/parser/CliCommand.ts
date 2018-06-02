import {CliOption} from './CliOption';

export type CommandHandler = (command: CliCommand, options: CliOption[]) => Promise<void>;

export class CliCommand {
    public command: string;
    public handler: CommandHandler;
    public options: CliOption[];
    public description: string;

    constructor(command: string, description: string, options: CliOption[], handler: CommandHandler) {
        this.command = command;
        this.handler = handler;
        this.options = options;
        this.description = description;
    }
}
