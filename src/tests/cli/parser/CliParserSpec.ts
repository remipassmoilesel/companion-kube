import * as chai from 'chai';
import * as sinon from 'sinon';
import {CliCommand, IParsedArguments} from '../../../lib/cli/parser/CliCommand';
import {CliOption} from '../../../lib/cli/parser/CliOption';
import {CliParser} from '../../../lib/cli/parser/CliParser';
import {TestHelpers} from '../../utils/TestHelpers';

const assert = chai.assert;

describe(' > CliParserSpec', async function () {
    this.timeout(2000);

    const listStub = sinon.stub();
    const deployStub = sinon.stub();

    const listCommand = new CliCommand(
        'list',
        'List some stuff',
        [
            new CliOption('force', 'f', 'boolean', 'Force'),
            new CliOption('environment', 'e', 'string', 'Environment'),
        ],
        listStub,
    );
    const deployCommand = new CliCommand(
        'svc deploy',
        'Deploy some stuff',
        [
            new CliOption('force', 'f', 'boolean', 'Force'),
            new CliOption('environment', 'e', 'string', 'Environment'),
        ],
        deployStub,
    );

    const commands: CliCommand[] = [listCommand, deployCommand];

    let cliParser: CliParser;

    beforeEach(() => {
        cliParser = new CliParser(commands);
        listStub.reset();
        deployStub.reset();
    });

    describe('With invalid commands or options', () => {

        it('Parser should throw if command to parse is invalid', async () => {
            await TestHelpers.asyncAssertThrows(() => {
                return cliParser.parse(['non existing command']);
            }, /Invalid command:.+/);
            assert.lengthOf(listStub.getCalls(), 0);
            assert.lengthOf(deployStub.getCalls(), 0);
        });

        it('Parser should throw if command name is invalid', async () => {
            assert.throws(() => {
                cliParser.addAllCommands([new CliCommand('list$', '', [], listStub)]);
            }, /Invalid command name, must match: .+/i);
        });

        it('Parser should throw if option short name is invalid', async () => {
            assert.throws(() => {
                const badOption = new CliOption('name', '$short', 'boolean', '');
                cliParser.addAllCommands([new CliCommand('list2', '', [badOption], listStub)]);
            }, /Invalid option shortname, must match: .+/i);
        });

        it('Parser should throw if option name is invalid', async () => {
            assert.throws(() => {
                const badOption = new CliOption('$name', 'short', 'boolean', '');
                cliParser.addAllCommands([new CliCommand('list3', '', [badOption], listStub)]);
            }, /Invalid option name, must match: .+/i);
        });

        it('Parser should throw if command already exists', async () => {
            assert.throws(() => {
                const badOption = new CliOption('name', 'short', 'boolean', '');
                cliParser.addAllCommands([new CliCommand('list4', '', [badOption], listStub)]);
                cliParser.addAllCommands([new CliCommand('list4', '', [badOption], listStub)]);
            }, /Command already exists:.+/i);
        });

        it('Parser should throw if option already exists', async () => {
            assert.throws(() => {
                const badOption = new CliOption('name', 'short', 'boolean', '');
                cliParser.addAllCommands([new CliCommand('list4', '', [badOption, badOption], listStub)]);
            }, /Option is duplicated:.+/i);
        });

    });

    describe('Command parsing', () => {

        it('Parser should execute list handler', async () => {
            await cliParser.parse(['list']);
            assert.lengthOf(listStub.getCalls(), 1);
            assert.lengthOf(deployStub.getCalls(), 0);

            const calledCommand: CliCommand = listStub.getCall(0).args[0];
            assert.deepEqual(calledCommand.command, listCommand.command);
        });

        it('Parser should execute deploy handler', async () => {
            await cliParser.parse(['svc', 'deploy']);
            assert.lengthOf(listStub.getCalls(), 0);
            assert.lengthOf(deployStub.getCalls(), 1);

            const calledCommand: CliCommand = deployStub.getCall(0).args[0];
            assert.deepEqual(calledCommand.command, deployCommand.command);
        });

        it('Parser should parse boolean options correctly', async () => {
            await cliParser.parse(['svc', 'deploy', '-f']);
            const parsedArguments: IParsedArguments = deployStub.getCall(0).args[1];
            assert.isTrue(parsedArguments.f);
            assert.isTrue(parsedArguments.force);
            assert.isUndefined(parsedArguments.e);
            assert.isUndefined(parsedArguments.environment);
        });

        it('Parser should parse string options correctly', async () => {
            await cliParser.parse(['svc', 'deploy', '-f', '-e', 'dev']);
            const parsedArguments: IParsedArguments = deployStub.getCall(0).args[1];
            assert.isTrue(parsedArguments.f);
            assert.isTrue(parsedArguments.force);
            assert.equal(parsedArguments.e, 'dev');
            assert.equal(parsedArguments.environment, 'dev');
            assert.deepEqual(parsedArguments.remainingArguments, []);
        });

        it('Parser should parse string options correctly', async () => {
            await TestHelpers.asyncAssertThrows(() => {
                return cliParser.parse(['svc', 'deploy', '-f', '-e']);
            }, /Option --environment must have a value/);

            assert.lengthOf(listStub.getCalls(), 0);
            assert.lengthOf(deployStub.getCalls(), 0);
        });

        it('Parser should parse string options correctly even with supplementary arguments', async () => {
            await cliParser.parse(['svc', 'deploy', 'application1', '-f', '-e', 'dev', 'application2']);
            const parsedArguments: IParsedArguments = deployStub.getCall(0).args[1];
            assert.isTrue(parsedArguments.f);
            assert.isTrue(parsedArguments.force);
            assert.equal(parsedArguments.e, 'dev');
            assert.equal(parsedArguments.environment, 'dev');
            assert.deepEqual(parsedArguments.remainingArguments, ['application1', 'application2']);
        });

    });

});

