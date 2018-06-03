import * as chai from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {CommandExecutor} from '../../lib/utils/CommandExecutor';
import {Api} from '../../lib/Api';
import {Cli} from '../../lib/Cli';
import {INVALID_CONF_DIR, VALID_CONF_DIR, VALID_CONF_DIR_PARENT} from '../setupSpec';
import {CliDisplay} from '../../lib/cli/CliDisplay';
import {
    assertCliError,
    assertNoCliErrors,
    buildCommand,
    getCallArgumentsWithoutPrereqChecks,
    getTestConfig,
} from './CliSpecHelpers';
import {
    expectedBuildCommands,
    expectedBuildPushCommands,
    expectedDeployCommandsWithEnvFlag,
    expectedDeployCommandsWithoutEnvFlag
} from './CliSpecData';

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

    describe('Docker commands', () => {

        beforeEach(() => {
            showWarningOnAppsStub.returns(Promise.resolve());
        });

        it(' > Build images in current dir should work', async () => {
            processCwdStub.returns(VALID_CONF_DIR);
            await cli.parseArguments(buildCommand('build'));
            const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

            assertNoCliErrors(onErrorStub);
            assert.deepEqual(callArgs, expectedBuildCommands);
        });

        it(' > Build images from parent dir should work', async () => {
            processCwdStub.returns(VALID_CONF_DIR_PARENT);
            await cli.parseArguments(buildCommand('build application-name'));
            const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

            assertNoCliErrors(onErrorStub);
            assert.deepEqual(callArgs, expectedBuildCommands);
        });

        it(' > Build and push images in current dir should work', async () => {
            processCwdStub.returns(VALID_CONF_DIR);
            await cli.parseArguments(buildCommand('build-push'));
            const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

            assertNoCliErrors(onErrorStub);
            assert.deepEqual(callArgs, expectedBuildPushCommands);
        });

        it(' > Build and push images from parent dir should work', async () => {
            processCwdStub.returns(VALID_CONF_DIR_PARENT);
            await cli.parseArguments(buildCommand('build-push application-name'));
            const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

            assertNoCliErrors(onErrorStub);
            assert.deepEqual(callArgs, expectedBuildPushCommands);
        });

    });

    describe('Deployment commands', () => {

        describe('Without environment flag', () => {

            beforeEach(() => {
                showWarningOnAppsStub.returns(Promise.resolve());
            });

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_CONF_DIR);
                await cli.parseArguments(buildCommand('deploy'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsWithoutEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_CONF_DIR_PARENT);
                await cli.parseArguments(buildCommand('deploy application-name'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsWithoutEnvFlag);
            });

        });

        describe('With environment flag', () => {

            beforeEach(() => {
                showWarningOnAppsStub.returns(Promise.resolve());
            });

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_CONF_DIR);
                await cli.parseArguments(buildCommand('deploy -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsWithEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_CONF_DIR_PARENT);
                await cli.parseArguments(buildCommand('deploy application-name -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsWithEnvFlag);
            });

        });

    });

});

