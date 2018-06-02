import * as chai from 'chai';
import {TestHelpers} from './TestHelpers';

const assert = chai.assert;

describe.only(' > TestHelperSpec', async function () {
    this.timeout(2000);

    it('TestHelper.asyncAssertThrows should fail if cb does not throw', async () => {
        try {
            await TestHelpers.asyncAssertThrows(() => {
                return Promise.resolve();
            }, /Invalid command:.+/);

            throw new Error('Function expected to throw');
        } catch (e) {
            if (!e.message.match(/Error message does not match:.+/)) {
                throw new Error(`Message does not match expected pattern: ${e.message}`);
            }
        }
    });

});

