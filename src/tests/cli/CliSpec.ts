import * as chai from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {CommandExecutor} from '../../lib/utils/CommandExecutor';
import {Api} from '../../lib/Api';
import {Cli} from '../../lib/Cli';
import {INVALID_CONF_DIR, VALID_CONF_DIR} from '../setupSpec';
import {CliDisplay} from '../../lib/cli/CliDisplay';
import {
    assertCliError,
    assertNoCliErrors,
    buildCommand,
    getCallArgumentsWithoutPrereqChecks,
    getTestConfig,
} from './CliSpecHelpers';

const assert = chai.assert;

describe(' > CliSpec', function () {
    this.timeout(2000);

    const commandExec = new CommandExecutor();
    const commandExecStub: SinonStub = sinon.stub(commandExec, 'execCommand');

    const processCwdStub: SinonStub = sinon.stub(process, 'cwd');
    const onErrorStub: SinonStub = sinon.stub();

    const fsWriteFileSyncStub = sinon.stub(fs, 'writeFileSync');
    const fsExistsSyncStub = sinon.stub(fs, 'existsSync');

    const mainConfig = getTestConfig();

    const cliDisplay = new CliDisplay();
    const showWarningOnAppsStub = sinon.stub(cliDisplay, 'showWarningOnApps');

    const api = new Api(mainConfig, commandExec);
    const cli = new Cli(mainConfig, api, commandExec, cliDisplay, onErrorStub);
    cli.setupParser();

    afterEach(() => {
        processCwdStub.reset();
        onErrorStub.reset();
        commandExecStub.reset();
        fsWriteFileSyncStub.reset();
        fsExistsSyncStub.reset();
        showWarningOnAppsStub.reset();
    });

    after(() => {
        processCwdStub.restore();
        fsWriteFileSyncStub.restore();
        fsExistsSyncStub.restore();
    });

    describe('Invalid input', () => {

        it(' > Empty command should throw', async () => {
            await cli.parseArguments(buildCommand(''));
            assertCliError(/You must specify a command.+/i, onErrorStub);
        });

        it(' > Non existing command should throw', async () => {
            await cli.parseArguments(buildCommand('non existing command'));
            assertCliError(/Invalid command:.+/i, onErrorStub);
        });

    });

    describe('Init', () => {

        beforeEach(() => {
            processCwdStub.returns('/tmp');
        });

        it(' > Init should work', async () => {
            fsExistsSyncStub.returns(false);
            await cli.parseArguments(buildCommand('init'));
            assertNoCliErrors(onErrorStub);
        });

        it(' > Init should throw if file already exists', async () => {
            fsExistsSyncStub.returns(true);
            await cli.parseArguments(buildCommand('init'));
            assertCliError(/File 'ck-config.js' already exist !/i, onErrorStub);
        });

        it(' > Init should not throw if file already exists and if forced', async () => {
            fsExistsSyncStub.returns(true);
            await cli.parseArguments(buildCommand('init -f'));
            assertNoCliErrors(onErrorStub);
        });

    });

    describe('List', () => {

        it(' > List should not throw if all configurations are valid', async () => {
            processCwdStub.returns(VALID_CONF_DIR);
            await cli.parseArguments(buildCommand('list'));
            assertNoCliErrors(onErrorStub);
        });

        it(' > List should throw if configurations are invalid', async () => {
            processCwdStub.returns(INVALID_CONF_DIR);
            await cli.parseArguments(buildCommand('list'));
            assertCliError(/Invalid configurations found/i, onErrorStub);
        });

    });

    describe('Docker', () => {

        beforeEach(() => {
            showWarningOnAppsStub.returns(Promise.resolve());
        });

        it(' > Build images should work', async () => {
            processCwdStub.returns(VALID_CONF_DIR);
            await cli.parseArguments(buildCommand('build'));
            const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);
            const expected = [
                ['./pre-build.sh', {displayOutput: true},
                    {cwd: '/home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid'}],
                ['docker build /home/remipassmoilesel/projects/companion-kube/src/tests/test-data/valid/path/to/'
                + 'docker/build -t deployment-with-docker-file:0.1',
                    {displayOutput: true}],
            ];

            assert.deepEqual(callArgs, expected);
        });

    });

});

