import * as chai from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {CommandExecutor} from '../../lib/utils/CommandExecutor';
import {Api} from '../../lib/Api';
import {Cli} from '../../lib/Cli';
import {
    INVALID_APP_DIR,
    VALID_DEPLOYMENT_APP_DIR,
    VALID_DEPLOYMENT_APP_PARENT,
    VALID_DEPLOYMENT_SVC_DIR
} from '../setupSpec';
import {CliDisplay} from '../../lib/cli/CliDisplay';
import {
    assertCliError,
    assertNoCliErrors,
    buildCommand,
    getCallArgumentsWithoutPrereqChecks,
    getTestConfig,
} from './CliSpecHelpers';
import {
    expectedAppBuildPushCommands,
    expectedAppDockerBuildCommands,
    expectedSvcDockerBuildCommands
} from './CliSpecData';

const assert = chai.assert;

describe(' > MiscCommandsSpec', function () {
    this.timeout(2000);

    const mainConfig = getTestConfig();

    let commandExec: CommandExecutor;
    let commandExecStub: SinonStub;
    let processCwdStub: SinonStub;
    let onErrorStub: SinonStub;
    let fsWriteFileSyncStub: SinonStub;
    let fsExistsSyncStub: SinonStub;
    let cliDisplay: CliDisplay;
    let showWarningOnAppsStub: SinonStub;
    let api: Api;
    let cli: Cli;

    before(() => {
        commandExec = new CommandExecutor();
        commandExecStub = sinon.stub(commandExec, 'execCommand');

        processCwdStub = sinon.stub(process, 'cwd');
        onErrorStub = sinon.stub();

        fsWriteFileSyncStub = sinon.stub(fs, 'writeFileSync');
        fsExistsSyncStub = sinon.stub(fs, 'existsSync');

        cliDisplay = new CliDisplay();
        showWarningOnAppsStub = sinon.stub(cliDisplay, 'showWarningOnApps');

        api = new Api(mainConfig, commandExec);
        cli = new Cli(mainConfig, api, commandExec, cliDisplay, onErrorStub);
        cli.setupParser();
    });

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
            processCwdStub.returns(VALID_DEPLOYMENT_APP_DIR);
            await cli.parseArguments(buildCommand('list'));
            assertNoCliErrors(onErrorStub);
        });

        it(' > List should throw if configurations are invalid', async () => {
            processCwdStub.returns(INVALID_APP_DIR);
            await cli.parseArguments(buildCommand('list'));
            assertCliError(/Invalid configurations found/i, onErrorStub);
        });

    });

    describe('Docker commands', () => {

        beforeEach(() => {
            showWarningOnAppsStub.returns(Promise.resolve());
        });

        describe('Applications', () => {

            it(' > Build images in current dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_APP_DIR);
                await cli.parseArguments(buildCommand('build'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDockerBuildCommands);
            });

            it(' > Build images from parent dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_APP_PARENT);
                await cli.parseArguments(buildCommand('build valid-deployment-app'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDockerBuildCommands);
            });

            it(' > Build and push images in current dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_APP_DIR);
                await cli.parseArguments(buildCommand('build-push'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppBuildPushCommands);
            });

            it(' > Build and push images from parent dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_APP_PARENT);
                await cli.parseArguments(buildCommand('build-push valid-deployment-app'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppBuildPushCommands);
            });

        });

        describe('Services', () => {

            it(' > Build images in current dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_SVC_DIR);
                await cli.parseArguments(buildCommand('build'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedSvcDockerBuildCommands);
            });

            it(' > Build images from parent dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_SVC_DIR);
                await cli.parseArguments(buildCommand('build valid-deployment-svc'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedSvcDockerBuildCommands);
            });

        });

    });

});

