import * as chai from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {CommandExecutor} from '../../lib/utils/CommandExecutor';
import {Api} from '../../lib/Api';
import {Cli} from '../../lib/Cli';
import {
    VALID_CHART_APP_DIR,
    VALID_CHART_APP_PARENT,
    VALID_DEPLOYMENT_APP_DIR,
    VALID_DEPLOYMENT_APP_PARENT,
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
    expectedDeployCommandsForHelmChartWithEnvFlag,
    expectedDeployCommandsForHelmChartWithoutEnvFlag,
    expectedDeployCommandsForManifestWithEnvFlag,
    expectedDeployCommandsForManifestWithoutEnvFlag,
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

    describe('Deployment commands with Kubernetes manifests', () => {

        describe('Without environment flag', () => {

            beforeEach(() => {
                showWarningOnAppsStub.returns(Promise.resolve());
            });

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_APP_DIR);
                await cli.parseArguments(buildCommand('deploy'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsForManifestWithoutEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_APP_PARENT);
                await cli.parseArguments(buildCommand('deploy valid-deployment-app'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsForManifestWithoutEnvFlag);
            });

        });

        describe('With environment flag', () => {

            beforeEach(() => {
                showWarningOnAppsStub.returns(Promise.resolve());
            });

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_APP_DIR);
                await cli.parseArguments(buildCommand('deploy -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsForManifestWithEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_APP_PARENT);
                await cli.parseArguments(buildCommand('deploy valid-deployment-app -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsForManifestWithEnvFlag);
            });

        });

        describe.skip('Services', () => {

            beforeEach(() => {
                showWarningOnAppsStub.returns(Promise.resolve());
            });

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_APP_DIR);
                await cli.parseArguments(buildCommand('deploy -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsForManifestWithEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_APP_PARENT);
                await cli.parseArguments(buildCommand('deploy valid-deployment-app -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsForManifestWithEnvFlag);
            });

        });

    });

    describe('Deployment commands with Helm Charts', () => {

        describe('Without environment flag', () => {

            beforeEach(() => {
                showWarningOnAppsStub.returns(Promise.resolve());
            });

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_CHART_APP_DIR);
                await cli.parseArguments(buildCommand('deploy'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsForHelmChartWithoutEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_CHART_APP_PARENT);
                await cli.parseArguments(buildCommand('deploy valid-chart-app'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsForHelmChartWithoutEnvFlag);
            });

        });

        describe('With environment flag', () => {

            beforeEach(() => {
                showWarningOnAppsStub.returns(Promise.resolve());
            });

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_CHART_APP_DIR);
                await cli.parseArguments(buildCommand('deploy -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsForHelmChartWithEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_CHART_APP_PARENT);
                await cli.parseArguments(buildCommand('deploy valid-chart-app -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedDeployCommandsForHelmChartWithEnvFlag);
            });

        });

    });

});

