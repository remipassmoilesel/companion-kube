import * as chai from 'chai';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {CommandExecutor} from '../lib/misc/CommandExecutor';
import {Api} from '../lib/Api';
import {mainConfig} from '../lib/main-config/config';
import {Cli} from '../lib/Cli';

const assert = chai.assert;

describe(' > CliSpec', function () {
    this.timeout(2000);

    const commandExec = new CommandExecutor();
    const execStub: SinonStub = sinon.stub(commandExec, 'execCommand');

    const onErrorStub: SinonStub = sinon.stub();

    const api = new Api(mainConfig, commandExec);
    const cli = new Cli(mainConfig, api, commandExec, onErrorStub);

    const argvPart: string[] = [
        '/usr/local/bin/node',
        '/home/remipassmoilesel/npm-root/bin/ck',
    ];

    const assertError = (regexp: RegExp) => {
        assert.lengthOf(onErrorStub.getCalls(), 1);
        const error = onErrorStub.getCalls()[0].args[0];
        assert.instanceOf(error, Error);
        assert.match(error.message, regexp);
    };

    afterEach(() => {
        onErrorStub.resetHistory();
    });

    it(' > Invalid commands should throw', async () => {
        const args: string[] = argvPart.concat('');
        await cli.setupAndParse(args);
        assertError(/You must specify a command. Try: ck help/i);
    });

});

