import * as chai from 'chai';
import {mainConfig} from '../../lib/main-config/config';
import {AppConfigurationManager} from '../../lib/app-config/AppConfigurationManager';

const assert = chai.assert;

describe(' > AppConfigurationManagerSpec', function () {
    this.timeout(2000);

    const configMan = new AppConfigurationManager(mainConfig);

    it(' > Validate example config should succeed', () => {
        // configMan.
    });

});

