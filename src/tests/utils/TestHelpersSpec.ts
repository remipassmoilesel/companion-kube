import * as chai from 'chai';
import {TestHelpers} from './TestHelpers';

const assert = chai.assert;

describe(' > TestHelperSpec', async function () {
    this.timeout(2000);

    it('TestHelper.asyncAssertThrows should fail if cb does not throw', async () => {
        try {
            await TestHelpers.asyncAssertThrows(() => {
                return Promise.resolve();
            }, /Invalid command:.+/);

            throw new Error('TestHelpers.asyncAssertThrows did not throw !');
        } catch (e) {
            if (!e.message.match(/Function expected to throw an error+/)) {
                throw new Error(`Message does not match expected pattern: ${e.message}`);
            }
        }
    });

    it('TestHelper.asyncAssertThrows should fail if cb throws a wrong message', async () => {
        try {
            await TestHelpers.asyncAssertThrows(() => {
                return Promise.reject(new Error('Wrong message'));
            }, /Invalid command:.+/);

            throw new Error('Function expected to throw');
        } catch (e) {
            if (!e.message.match(/Error message does not match:.+/)) {
                throw new Error(`Message does not match expected pattern: ${e.message}`);
            }
        }
    });

    it('TestHelper.asyncAssertThrows should succeed if cb throws a correct message', async () => {
        await TestHelpers.asyncAssertThrows(() => {
            return Promise.reject(new Error('Invalid command: hey hey !'));
        }, /Invalid command:.+/);
    });

});

