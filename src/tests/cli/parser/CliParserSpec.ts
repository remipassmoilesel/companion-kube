import * as chai from 'chai';
import * as sinon from 'sinon';
import {CliCommand} from '../../../lib/cli/parser/CliCommand';
import {CliOption} from '../../../lib/cli/parser/CliOption';
import {CliParser} from '../../../lib/cli/parser/CliParser';
import {TestHelpers} from '../../utils/TestHelpers';

const assert = chai.assert;

describe.only(' > CliParserSpec', async function () {
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

    it('Parser should throw if command is invalid', async () => {
        await TestHelpers.asyncAssertThrows(() => {
            return cliParser.parse(['non existing command']);
        }, /Invalid command:.+/);
        assert.lengthOf(listStub.getCalls(), 0);
        assert.lengthOf(deployStub.getCalls(), 0);
    });

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

});

