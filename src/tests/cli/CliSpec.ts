import * as chai from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {CommandExecutor} from '../../lib/utils/CommandExecutor';
import {Api} from '../../lib/Api';
import {getMainConfig} from '../../lib/main-config/config';
import {Cli} from '../../lib/Cli';
import {INVALID_CONF_DIR, VALID_CONF_DIR} from '../setupSpec';

const assert = chai.assert;

describe(' > CliSpec', function () {
    this.timeout(2000);

    const commandExec = new CommandExecutor();
    const execStub: SinonStub = sinon.stub(commandExec, 'execCommand');

    const processCwdStub: SinonStub = sinon.stub(process, 'cwd');
    const onErrorStub: SinonStub = sinon.stub();

    const mainConfig = getMainConfig();
    mainConfig.configSearchIgnore = [];
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

    const assertNoCliErrors = () => {
        assert.lengthOf(onErrorStub.getCalls(), 0, 'Cli errors occurred');
    };

    const tmpDir = os.tmpdir();
    const tempCkConfig = path.join(tmpDir, 'ck-config.js');

    afterEach(() => {
        processCwdStub.reset();
        onErrorStub.reset();
        execStub.reset();

        if (fs.existsSync(tempCkConfig)) {
            fs.unlinkSync(tempCkConfig);
        }
    });

    it(' > Invalid commands should throw', async () => {
        await cli.setupAndParse(buildCommand(''));
        assertCliError(/You must specify a command. Try: ck help/i);
    });

    describe('Init', () => {

        it(' > Init should work', async () => {
            processCwdStub.returns(tmpDir);
            await cli.setupAndParse(buildCommand('init'));
            assertNoCliErrors();
        });

        it(' > Init should throw if file already exists', async () => {
            processCwdStub.returns(tmpDir);
            await cli.setupAndParse(buildCommand('init'));
            await cli.setupAndParse(buildCommand('init'));
            assertCliError(/File 'ck-config.js' already exist !/i);
        });

        it(' > Init should not throw if file already exists and if forced', async () => {
            processCwdStub.returns(tmpDir);
            await cli.setupAndParse(buildCommand('init'));
            assertNoCliErrors();
            await cli.setupAndParse(buildCommand('init -f'));
            assertNoCliErrors();
        });

    });

    describe('List', () => {

        it(' > List not throw if all configurations are valid', async () => {
            processCwdStub.returns(VALID_CONF_DIR);
            await cli.setupAndParse(buildCommand('list'));
            assertNoCliErrors();
        });

        it(' > List should throw if configurations are invalid', async () => {
            processCwdStub.returns(INVALID_CONF_DIR);
            await cli.setupAndParse(buildCommand('list'));
            assertCliError(/Invalid configurations found/i);
        });

    });

});

