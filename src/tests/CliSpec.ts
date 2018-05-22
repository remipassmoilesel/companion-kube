import * as chai from 'chai';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {CommandExecutor} from '../lib/utils/CommandExecutor';
import {Api} from '../lib/Api';
import {mainConfig} from '../lib/main-config/config';
import {Cli} from '../lib/Cli';
import {INVALID_CONF_DIR} from './setupSpec';

const assert = chai.assert;

describe(' > CliSpec', function () {
    this.timeout(2000);

    const commandExec = new CommandExecutor();
    const execStub: SinonStub = sinon.stub(commandExec, 'execCommand');

    const processCwdStub: SinonStub = sinon.stub(process, 'cwd');
    const onErrorStub: SinonStub = sinon.stub();

    const api = new Api(mainConfig, commandExec);
    const cli = new Cli(mainConfig, api, commandExec, onErrorStub);

    const argvPart: string[] = [
        '/usr/local/bin/node',
        '/home/user/npm-root/bin/ck',
    ];

    const buildCommand = (command: string): string[] => {
        return argvPart.concat(command.split(' '));
    };

    const assertCliError = (regexp: RegExp) => {
        assert.lengthOf(onErrorStub.getCalls(), 1, 'Error stub was not called');
        const error = onErrorStub.getCalls()[0].args[0];
        assert.instanceOf(error, Error);
        assert.match(error.message, regexp);
    };

    afterEach(() => {
        processCwdStub.reset();
        onErrorStub.reset();
    });

    it(' > Invalid commands should throw', async () => {
        await cli.setupAndParse(buildCommand(''));
        assertCliError(/You must specify a command. Try: ck help/i);
    });

    it(' > Invalid config should throw', async () => {
        processCwdStub.returns(INVALID_CONF_DIR);
        await cli.setupAndParse(buildCommand('list'));
        assertCliError(/Invalid configurations found/i);
    });

});

