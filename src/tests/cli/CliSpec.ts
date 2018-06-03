import * as chai from 'chai';
import * as fs from 'fs';
import * as _ from 'lodash';
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

    const fsWriteFileSyncStub = sinon.stub(fs, 'writeFileSync');
    const fsExistsSyncStub = sinon.stub(fs, 'existsSync');

    const mainConfig = getMainConfig();
    mainConfig.configSearchIgnore = []; // do not ignore test data

    const api = new Api(mainConfig, commandExec);
    const cli = new Cli(mainConfig, api, commandExec, onErrorStub);
    cli.setupParser();

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

    const showCliErrors = () => {
        _.forEach(onErrorStub.getCalls(), (call) => {
            console.log(call.args);
        });
    };

    const assertNoCliErrors = () => {
        assert.lengthOf(onErrorStub.getCalls(), 0, 'Cli errors occurred');
    };

    afterEach(() => {
        processCwdStub.reset();
        onErrorStub.reset();
        execStub.reset();
        fsWriteFileSyncStub.reset();
        fsExistsSyncStub.reset();
    });

    after(() => {
        processCwdStub.restore();
        fsWriteFileSyncStub.restore();
        fsExistsSyncStub.restore();
    });

    describe('Invalid input', () => {

        it(' > Empty command should throw', async () => {
            await cli.parseArguments(buildCommand(''));
            assertCliError(/You must specify a command.+/i);
        });

        it(' > Non existing command should throw', async () => {
            await cli.parseArguments(buildCommand('non existing command'));
            assertCliError(/Invalid command:.+/i);
        });

    });

    describe('Init', () => {

        it(' > Init should work', async () => {
            processCwdStub.returns('/tmp');
            fsExistsSyncStub.returns(false);
            await cli.parseArguments(buildCommand('init'));
            assertNoCliErrors();
        });

        it(' > Init should throw if file already exists', async () => {
            processCwdStub.returns('/tmp');
            fsExistsSyncStub.returns(true);
            await cli.parseArguments(buildCommand('init'));
            assertCliError(/File 'ck-config.js' already exist !/i);
        });

        it(' > Init should not throw if file already exists and if forced', async () => {
            processCwdStub.returns('/tmp');
            fsExistsSyncStub.returns(true);
            await cli.parseArguments(buildCommand('init -f'));
            assertNoCliErrors();
        });

    });

    describe('List', () => {

        it(' > List should not throw if all configurations are valid', async () => {
            processCwdStub.returns(VALID_CONF_DIR);
            await cli.parseArguments(buildCommand('list'));
            assertNoCliErrors();
        });

        it(' > List should throw if configurations are invalid', async () => {
            processCwdStub.returns(INVALID_CONF_DIR);
            await cli.parseArguments(buildCommand('list'));
            assertCliError(/Invalid configurations found/i);
        });

    });

});

