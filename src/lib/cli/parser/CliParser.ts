import * as _ from 'lodash';
import {CliCommand} from './CliCommand';
import {ICliOptionValue} from './CliOption';

export class CliParser {

    private commands: CliCommand[];

    constructor(commands: CliCommand[]) {
        this.commands = [];
        this.addAllCommands(commands);
    }

    public addCommand(command: CliCommand) {
        this.checkCommand(command);
        this.commands.push(command);
    }

    public addAllCommands(command: CliCommand[]) {
        _.forEach(command, (comm) => {
            this.checkCommand(comm);
            this.commands.push(comm);
        });
    }

    public async parse(args: string[]): Promise<void> {
        const command: CliCommand = this.findCorrespondingCommand(args);

        const argsWithoutCommand = args.slice(command.commandArray.length);
        const {parsedOptions, argsWithoutOptions} = this.parseOptions(command, argsWithoutCommand);

        const parsedArgs = this.buildParsedArgs(command, parsedOptions, argsWithoutOptions);
        await command.handler(command, parsedArgs);
    }

    private findCorrespondingCommand(args: string[]): CliCommand {
        const found: CliCommand[] = _.filter(this.commands, (comm: CliCommand) => {
            const slicedArgs = args.slice(0, comm.commandArray.length);
            return _.isEqual(comm.commandArray, slicedArgs);
        });
        if (!found.length) {
            throw new Error(`Invalid command: ${args.join(' ')}`);
        }
        if (found.length > 1) {
            throw new Error(`Several commands matching: ${args.join(' ')}`);
        }
        return found[0];
    }

    private parseOptions(command: CliCommand,
                         args: string[]): { parsedOptions: ICliOptionValue[], argsWithoutOptions: string[] } {
        const clonedArgs = _.clone(args);
        const parsedOptions: ICliOptionValue[] = [];
        _.forEach(clonedArgs, (arg: string, index: number) => {
            const match: RegExpMatchArray | null = arg.match(/^-?-([a-z0-9-]+)/);
            if (match) {
                const option = _.find(command.options, (opt) => opt.shortname === match[1] || opt.name === match[1]);
                if (!option) {
                    throw new Error(`Invalid option: ${option}`);
                }
                if (option.type === 'boolean') {
                    parsedOptions.push({
                        name: option.name,
                        shortname: option.shortname,
                        value: true,
                    });
                    clonedArgs.splice(index, 1);
                }
                else {
                    parsedOptions.push({
                        name: option.name,
                        shortname: option.shortname,
                        value: clonedArgs[index + 1],
                    });

                    clonedArgs.splice(index, 2);
                }
            }
        });
        return {parsedOptions, argsWithoutOptions: clonedArgs};
    }

    private buildParsedArgs(command: CliCommand, parsedOptions: ICliOptionValue[], rest: string[]): any {
        const parsedArgs: any = {};
        _.forEach(parsedOptions, (opt: ICliOptionValue) => {
            parsedArgs[opt.name] = opt.value;
            parsedArgs[opt.shortname] = opt.value;
        });

        parsedArgs.remainingArguments = rest;
        return parsedArgs;
    }

    private checkCommand(command: CliCommand) {
        _.forEach(command.options, (opt) => {
            if (opt.name === 'remainingArguments') {
                throw new Error('Reserved word remainingArguments used as option name');
            }
            if (!opt.name.match(/^[a-z0-9-]+$/i)) {
                throw new Error('Invalid option name, must match: ^[a-z0-9-]+$');
            }
            if (!opt.shortname.match(/^[a-z0-9-]+$/i)) {
                throw new Error('Invalid option shortname, must match: ^[a-z0-9-]+$');
            }
        });
        if (!command.command.match(/^[a-z 0-9_-]+$/i)) {
            throw new Error('Invalid option shortname, must match: ^[a-z0-9-]+$');
        }
    }
}
