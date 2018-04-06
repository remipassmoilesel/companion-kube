import * as chai from 'chai';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {execSync} from 'child_process';
import {IPrerequisite} from '../../lib/prerequisites/prerequisites';
import {PrerequisiteChecker} from '../../lib/prerequisites/PrerequisiteChecker';
import {IMainConfig} from '../../lib/main-config/configTypes';

const assert = chai.assert;

describe(' > PrerequisitesChecker', function() {
    this.timeout(2000);

    const fakePrereq: IPrerequisite[] = [
        {
            command: 'fancy-command',
            installScript: 'scripts/prereq/fancy-command',
        },
    ];

    const testConfig: IMainConfig = {
        prerequisites: fakePrereq,
    } as any;

    let prereqChecker: PrerequisiteChecker;
    let execStub: SinonStub;

    beforeEach(() => {
        prereqChecker = new PrerequisiteChecker(testConfig);
        execStub = sinon.stub(prereqChecker as any, 'execSync');
    });

    afterEach(() => {
        execStub.resetBehavior();
    });

    it(' > getMissingPrerequisites should return empty array', () => {
        const missing = prereqChecker.getMissingPrerequisites();

        assert.lengthOf(execStub.getCalls(), 1);
        assert.isEmpty(missing);
    });

    it(' > getMissingPrerequisites should return one element array', () => {
        execStub.onFirstCall().throws(new Error());
        const missing = prereqChecker.getMissingPrerequisites();

        assert.lengthOf(execStub.getCalls(), 1);
        assert.lengthOf(missing, 1);
        assert.equal(missing[0].command, 'fancy-command');
    });

});

