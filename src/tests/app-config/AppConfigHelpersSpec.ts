import * as chai from 'chai';
import * as _ from 'lodash';
import {exampleCkConfig} from '../../lib/app-config/appConfigExample';
import {AppConfigHelpers} from '../../lib/app-config/AppConfigHelpers';
import {AppType} from '../../lib/app-config/appConfigTypes';

const assert = chai.assert;

describe(' > AppConfigHelpersSpec', function () {
    this.timeout(2000);

    it(' > Get light config should work', async () => {
        assert.isDefined(exampleCkConfig.id);
        assert.isDefined(exampleCkConfig.rootPath);
        assert.isDefined(exampleCkConfig.configPath);
        assert.isDefined(exampleCkConfig.type);

        const config = AppConfigHelpers.getLightAppConfig(exampleCkConfig);
        assert.isUndefined(config.id);
        assert.isUndefined(config.rootPath);
        assert.isUndefined(config.configPath);
        assert.isUndefined(config.type);

        assert.isTrue(config !== exampleCkConfig);
    });

    it(' > isType should work', () => {
        const appExampleClone = _.cloneDeep(exampleCkConfig);

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

