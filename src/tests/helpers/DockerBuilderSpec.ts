import * as chai from 'chai';
import * as sinon from 'sinon';
import {SinonSpyCall, SinonStub} from 'sinon';
import {CommandExecutor} from '../../lib/utils/CommandExecutor';
import {getMainConfig} from '../../lib/main-config/config';
import {DockerBuilder} from '../../lib/helpers/DockerBuilder';
import {testValidCkConfig} from '../test-data/testValidCkConfig';

const assert = chai.assert;

describe(' > DockerBuilderSpec', function () {
    this.timeout(2000);

    const mainConfig = getMainConfig();
    const commandExec = new CommandExecutor();
    const execStub: SinonStub = sinon.stub(commandExec, 'execCommand');

    const dockerBuilder = new DockerBuilder(mainConfig, commandExec);

    afterEach(() => {
        execStub.reset();
    });

    it(' > Build images should work', async () => {
        await dockerBuilder.build(testValidCkConfig);

        const execCalls: SinonSpyCall[] = execStub.getCalls();
        assert.lengthOf(execCalls, 2);
        assert.equal(execCalls[0].args[0],
            'docker build /test/root/path/path/to/docker/build-1 -t deployment-with-docker-file-1:0.1');
        assert.equal(execCalls[1].args[0],
            'docker build /test/root/path/path/to/docker/build-2 -t deployment-with-docker-file-2:0.1');
    });

    it(' > Push images should work', async () => {
        await dockerBuilder.push(testValidCkConfig);

        const execCalls: SinonSpyCall[] = execStub.getCalls();
        assert.lengthOf(execCalls, 2);
        assert.equal(execCalls[0].args[0],
            'docker push deployment-with-docker-file-1:0.1');
        assert.equal(execCalls[1].args[0],
            'docker push deployment-with-docker-file-2:0.1');
    });

});

