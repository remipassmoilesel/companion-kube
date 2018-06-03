import * as chai from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {CommandExecutor} from '../../lib/utils/CommandExecutor';
import {Api} from '../../lib/Api';
import {Cli} from '../../lib/Cli';
import {
    VALID_ANSIBLE_APP_DIR,
    VALID_APP_ROOT,
    VALID_CHART_APP_DIR,
    VALID_DEPLOYMENT_APP_DIR,
    VALID_DEPLOYMENT_SVC_DIR, VALID_SVC_ROOT,
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
    expectedAppDeployCommandsForManifestWithEnvFlag,
    expectedAppDeployCommandsForManifestWithoutEnvFlag,
    expectedAppDeployCommandsForHelmChartWithEnvFlag,
    expectedSvcDeployCommandsForManifestWithEnvFlag,
    expectedAppDeployCommandsForHelmChartWithoutEnvFlag,
    expectedSvcDeployCommandsForHelmChartWithEnvFlag,
    expectedAppDeployCommandsForAnsibleWithoutEnvFlag,
    expectedAppDeployCommandsForAnsibleWithEnvFlag,
} from './DeployCommandsSpecData';

const assert = chai.assert;

describe(' > DeployCommandsSpec', function () {
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

    beforeEach(() => {
        showWarningOnAppsStub.returns(Promise.resolve());
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

    describe('Deploy Kubernetes manifests', () => {

        describe('Application without environment flag', () => {

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_APP_DIR);
                await cli.parseArguments(buildCommand('deploy'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDeployCommandsForManifestWithoutEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_APP_ROOT);
                await cli.parseArguments(buildCommand('deploy valid-deployment-app'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDeployCommandsForManifestWithoutEnvFlag);
            });

        });

        describe('Application with environment flag', () => {

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_APP_DIR);
                await cli.parseArguments(buildCommand('deploy -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDeployCommandsForManifestWithEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_APP_ROOT);
                await cli.parseArguments(buildCommand('deploy valid-deployment-app -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDeployCommandsForManifestWithEnvFlag);
            });

        });

        describe('Deploy services', () => {

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_SVC_DIR);
                await cli.parseArguments(buildCommand('svc deploy -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedSvcDeployCommandsForManifestWithEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_SVC_ROOT);
                await cli.parseArguments(buildCommand('svc deploy valid-deployment-svc -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedSvcDeployCommandsForManifestWithEnvFlag);
            });

            it(' > Deploy without svc prefix should fail', async () => {
                processCwdStub.returns(VALID_SVC_ROOT);
                await cli.parseArguments(buildCommand('deploy valid-deployment-svc -e prod'));
                assertCliError(/Application not found:.+/i, onErrorStub);
            });

        });

    });

    describe('Deploy Helm Charts', () => {

        describe('Application without environment flag', () => {

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_CHART_APP_DIR);
                await cli.parseArguments(buildCommand('deploy'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDeployCommandsForHelmChartWithoutEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_APP_ROOT);
                await cli.parseArguments(buildCommand('deploy valid-chart-app'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDeployCommandsForHelmChartWithoutEnvFlag);
            });

        });

        describe('Application with environment flag', () => {

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_CHART_APP_DIR);
                await cli.parseArguments(buildCommand('deploy -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDeployCommandsForHelmChartWithEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_APP_ROOT);
                await cli.parseArguments(buildCommand('deploy valid-chart-app -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDeployCommandsForHelmChartWithEnvFlag);
            });

        });

        describe('Deploy services', () => {

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_SVC_DIR);
                await cli.parseArguments(buildCommand('svc deploy -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedSvcDeployCommandsForHelmChartWithEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_SVC_ROOT);
                await cli.parseArguments(buildCommand('svc deploy valid-deployment-svc -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedSvcDeployCommandsForHelmChartWithEnvFlag);
            });

            it(' > Deploy without svc prefix should fail', async () => {
                processCwdStub.returns(VALID_SVC_ROOT);
                await cli.parseArguments(buildCommand('deploy valid-deployment-svc -e prod'));
                assertCliError(/Application not found:.+/i, onErrorStub);
            });

        });

    });

    describe.only('Deploy Ansible playbooks', () => {

        beforeEach(() => {
            fsExistsSyncStub.returns(true);
        });

        describe.only('Application without environment flag', () => {

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_ANSIBLE_APP_DIR);
                await cli.parseArguments(buildCommand('deploy'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDeployCommandsForAnsibleWithoutEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_APP_ROOT);
                await cli.parseArguments(buildCommand('deploy valid-ansible-app'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDeployCommandsForAnsibleWithoutEnvFlag);
            });

        });

        describe('Application with environment flag', () => {

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_ANSIBLE_APP_DIR);
                await cli.parseArguments(buildCommand('deploy -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDeployCommandsForAnsibleWithEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_APP_ROOT);
                await cli.parseArguments(buildCommand('deploy valid-ansible-app -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedAppDeployCommandsForAnsibleWithEnvFlag);
            });

        });

        describe('Deploy services', () => {

            it(' > Deploy in current dir should work', async () => {
                processCwdStub.returns(VALID_DEPLOYMENT_SVC_DIR);
                await cli.parseArguments(buildCommand('svc deploy -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedSvcDeployCommandsForHelmChartWithEnvFlag);
            });

            it(' > Deploy from parent dir should work', async () => {
                processCwdStub.returns(VALID_SVC_ROOT);
                await cli.parseArguments(buildCommand('svc deploy valid-deployment-svc -e prod'));
                const callArgs = getCallArgumentsWithoutPrereqChecks(commandExecStub);

                assertNoCliErrors(onErrorStub);
                assert.deepEqual(callArgs, expectedSvcDeployCommandsForHelmChartWithEnvFlag);
            });

            it(' > Deploy without svc prefix should fail', async () => {
                processCwdStub.returns(VALID_SVC_ROOT);
                await cli.parseArguments(buildCommand('deploy valid-deployment-svc -e prod'));
                assertCliError(/Application not found:.+/i, onErrorStub);
            });

        });

    });

});

