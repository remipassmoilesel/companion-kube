import * as chai from 'chai';
import * as _ from 'lodash';
import {AppConfigHelpers} from '../../lib/app-config/AppConfigHelpers';
import {AppType} from '../../lib/app-config/appConfigTypes';
import {testValidDeploymentConfig} from '../test-data/testValidDeploymentConfig';

const assert = chai.assert;

describe(' > AppConfigHelpersSpec', function () {
    this.timeout(2000);

    it(' > Get light config should work', async () => {
        assert.isDefined(testValidDeploymentConfig.id);
        assert.isDefined(testValidDeploymentConfig.rootPath);
        assert.isDefined(testValidDeploymentConfig.configPath);
        assert.isDefined(testValidDeploymentConfig.type);

        const config = AppConfigHelpers.getLightAppConfig(testValidDeploymentConfig);
        assert.isUndefined(config.id);
        assert.isUndefined(config.rootPath);
        assert.isUndefined(config.configPath);
        assert.isUndefined(config.type);

        assert.isTrue(config !== testValidDeploymentConfig);
    });

    it(' > isType should work', () => {
        const appExampleClone = _.cloneDeep(testValidDeploymentConfig);

        appExampleClone.type = AppType.CLUSTER;
        assert.isTrue(AppConfigHelpers.isType(appExampleClone, AppType.CLUSTER));
        assert.isFalse(AppConfigHelpers.isType(appExampleClone, AppType.SERVICE_AND_APPLICATION));

        appExampleClone.type = AppType.SERVICE;
        assert.isTrue(AppConfigHelpers.isType(appExampleClone, AppType.SERVICE));
        assert.isTrue(AppConfigHelpers.isType(appExampleClone, AppType.SERVICE_AND_APPLICATION));

        appExampleClone.type = AppType.APPLICATION;
        assert.isTrue(AppConfigHelpers.isType(appExampleClone, AppType.APPLICATION));
        assert.isTrue(AppConfigHelpers.isType(appExampleClone, AppType.SERVICE_AND_APPLICATION));

    });

});

