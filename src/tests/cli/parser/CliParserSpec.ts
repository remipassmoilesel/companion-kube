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

    const commands: CliCommand[] = [
        new CliCommand(
            'list',
            'List some stuff',
            [
                new CliOption('force', 'f', 'boolean', 'Force'),
                new CliOption('environment', 'e', 'string', 'Environment'),
            ],
            async (command, options) => {
                console.log(command);
                console.log(options);
            },
        ),
        new CliCommand(
            'deploy',
            'Deploy some stuff',
            [
                new CliOption('force', 'f', 'boolean', 'Force'),
                new CliOption('environment', 'e', 'string', 'Environment'),
            ],
            async (command, options) => {
                console.log(command);
                console.log(options);
            },
        ),
    ];

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

});

