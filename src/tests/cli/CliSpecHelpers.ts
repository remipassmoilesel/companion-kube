import * as _ from 'lodash';
import * as chai from 'chai';
import {SinonStub} from 'sinon';
import {getMainConfig} from '../../lib/main-config/config';
import {IMainConfig} from '../../lib/main-config/configTypes';

const assert = chai.assert;

const argvPart: string[] = [
    '/usr/local/bin/node',
    '/home/user/npm-root/bin/ck',
];

export const getTestConfig = (): IMainConfig => {
    const mainConfig = getMainConfig();
    mainConfig.configSearchIgnore = []; // do not ignore test data
    return mainConfig;
};

const mainConfig = getTestConfig();

export const buildCommand = (command: string): string[] => {
    return argvPart.concat(command.split(' '));
};

export const assertCliError = (regexp: RegExp, onErrorStub: SinonStub) => {
    assert.lengthOf(onErrorStub.getCalls(), 1, 'Error stub was not called');
    const error = onErrorStub.getCalls()[0].args[0];
    assert.instanceOf(error, Error);
    assert.match(error.message, regexp);
};

export const showCliErrors = (onErrorStub: SinonStub) => {
    _.forEach(onErrorStub.getCalls(), (call) => {
        console.log(call.args);
    });
};

export const showStubCallArguments = (stubs: SinonStub[]) => {
    _.forEach(stubs, (stub, index) => {
        console.log();
        console.log(`### Stub ${index}`);
        _.forEach(stub.getCalls(), (call) => {
            console.log(call.args);
        });
    });
};

export const assertNoCliErrors = (onErrorStub: SinonStub) => {
    const calls = onErrorStub.getCalls();
    const errors: Error[] = _.map(calls, (call) => call.args[0]);
    assert.lengthOf(onErrorStub.getCalls(), 0, `Cli errors occurred: ${_.map(errors, (err) => err.message)}`);
};

export const getCallArgumentsWithoutPrereqChecks = (stub: SinonStub): any[] => {
    const allArgs = _.map(stub.getCalls(), (call) => call.args);
    // console.log(allArgs);
    return allArgs.slice(mainConfig.prerequisites.length);
};
