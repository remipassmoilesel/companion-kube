import * as _ from 'lodash';
import {CliCommand} from './CliCommand';
import {CliOption} from './CliOption';

export class CliParser {

    private commands: CliCommand[];

    constructor(commands: CliCommand[]) {
        this.commands = commands;
    }

    public addCommand(command: CliCommand){
        this.commands.push(command);
    }

    public async parse(args: string[]): Promise<void>{
        const command: CliCommand | undefined = this.findCorrespondingCommand(args);
        if (!command){
            throw new Error('Invalid command: ' + args.join(' '));
        }
        const options = this.parseOptions(args);
        await command.handler(command, options);
    }

    private findCorrespondingCommand(args: string[]): CliCommand | undefined {
        return undefined;
    }

    private parseOptions(args: string[]): CliOption[] {
        return [];
    }
}
