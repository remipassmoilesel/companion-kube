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
        const command: CliCommand = this.findCorrespondingCommand(args);
        const options = this.parseOptions(args);
        await command.handler(command, options);
    }

    private findCorrespondingCommand(args: string[]): CliCommand {
        const found: CliCommand[] = _.filter(this.commands, (comm: CliCommand) => {
            const parsedComm = comm.command.split(' ');
            const slicedArgs = args.slice(0, parsedComm.length);
            return _.isEqual(parsedComm, slicedArgs);
        });
        if (!found.length){
            throw new Error('Invalid command: ' + args.join(' '));
        }
        if (found.length > 1){
            throw new Error('Several commands matching: ' + args.join(' '));
        }
        return found[0];
    }

    private parseOptions(args: string[]): CliOption[] {
        return [];
    }
}
