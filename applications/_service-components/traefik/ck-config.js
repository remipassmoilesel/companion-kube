module.exports = {
    applicationStructure: 'deployment',
    scripts: {
        pushImages: 'ansible-playbook -i ../_cluster/inventory-dev.cfg playbook/push-images.yaml',
        buildDev: 'docker build ./docker-image -t traefik-dev',
        dev: 'ck run buildDev && docker run traefik-dev'
    }
};
