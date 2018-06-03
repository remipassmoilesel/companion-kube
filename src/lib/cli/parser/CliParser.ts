import * as _ from 'lodash';
import {CliCommand, IParsedArguments} from './CliCommand';
import {ICliOptionValue} from './CliOption';

export class CliParser {

    private commands: CliCommand[];

    constructor(commands?: CliCommand[]) {
        this.commands = [];
        if (commands){
            this.addAllCommands(commands);
        }
    }

    public addCommand(command: CliCommand) {
        this.checkCommand(command);
        this.commands.push(command);
    }

    public addAllCommands(command: CliCommand[]) {
        _.forEach(command, (comm) => {
            this.addCommand(comm);
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
        if (!args.length || args.length === 1 && !args[0]) {
            throw new Error(`You must specify a command, try 'help' !`);
        }

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
        const otherArgs: string[] = [];

        for (let index = 0; index < clonedArgs.length; index++) {
            const arg = clonedArgs[index];
            const match: RegExpMatchArray | null = arg.match(/^-?-([a-z0-9-]+)/);
            if (!match) {
                otherArgs.push(arg);
                continue;
            }
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
            }
            else {
                const optionValue = clonedArgs[index + 1];
                if (!optionValue){
                    throw new Error(`Option --${option.name} must have a value`);
                }

                parsedOptions.push({
                    name: option.name,
                    shortname: option.shortname,
                    value: clonedArgs[index + 1],
                });

                clonedArgs.splice(index + 1, 1);
            }
        }
        return {parsedOptions, argsWithoutOptions: otherArgs};
    }

    private buildParsedArgs(command: CliCommand, parsedOptions: ICliOptionValue[], rest: string[]): IParsedArguments {
        const parsedArgs: any = {};
        _.forEach(parsedOptions, (opt: ICliOptionValue) => {
            parsedArgs[opt.name] = opt.value;
            parsedArgs[opt.shortname] = opt.value;
        });

        parsedArgs.remainingArguments = rest;
        return parsedArgs;
    }

    private checkCommand(command: CliCommand) {
        if (!command.command.match(/^[a-z 0-9_-]+$/i)) {
            throw new Error('Invalid command name, must match: ^[a-z0-9-]+$');
        }

        const existing = _.find(this.commands, (comm) => comm.command === command.command);
        if (existing){
            throw new Error(`Command already exists: ${command.command}`);
        }

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
    }
}
