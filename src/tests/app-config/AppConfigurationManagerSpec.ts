import * as chai from 'chai';
import * as _ from 'lodash';
import {mainConfig} from '../../lib/main-config/config';
import {AppConfigurationManager} from '../../lib/app-config/AppConfigurationManager';
import {exampleCkConfig} from '../../lib/app-config/appConfigExample';
import {AppConfigHelpers} from '../../lib/app-config/AppConfigHelpers';

const assert = chai.assert;

describe(' > AppConfigurationManagerSpec', function () {
    this.timeout(2000);

    const configMan = new AppConfigurationManager(mainConfig);
    const validConfig = JSON.parse(JSON.stringify(AppConfigHelpers.getLightAppConfig(exampleCkConfig)));

    it(' > Validate example config should succeed', async () => {
        const {isValid, errors} = await configMan.validateConfig(validConfig);

        assert.isTrue(isValid);
        assert.isNull(errors);
    });

    it(' > Validate invalid config should fail', async () => {
        const invalidConfig = _.clone(validConfig);
        invalidConfig.test = 'test';

        const {isValid, errors} = await configMan.validateConfig(invalidConfig);

        assert.isFalse(isValid);
        assert.isArray(errors);
        assert.lengthOf(errors as any, 1);
    });

});

