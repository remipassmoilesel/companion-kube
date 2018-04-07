module.exports = {
    applicationStructure: 'deployment',
    deployment: {
        roots: ['./deployments'],
    },
    scripts: {
        pushImage: 'ansible-playbook -i ../_cluster/inventory-dev.cfg playbook/push-image.yaml',
        buildDev: 'docker build ./docker-image -t traefik-dev',
        dev: 'ck run buildDev && docker run traefik-dev',
        version: 'ck run buildDev && docker run traefik-dev version'
    },
    hooks: {
        preDeploy: 'ck run pushImage',
    }
};
