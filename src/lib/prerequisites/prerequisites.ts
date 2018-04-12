export interface IPrerequisite {
    command: string;
    description?: string;
    installScript: string;
}

export const PREREQUISITES: IPrerequisite[] = [
    {
        command: 'docker',
        installScript: 'scripts/prerequisites/install-docker.sh',
    },
    {
        command: 'kubectl',
        installScript: 'scripts/prerequisites/install-kubectl.sh',
    },
    {
        command: 'helm',
        installScript: 'scripts/prerequisites/install-helm.sh',
    },
    {
        command: 'ansible',
        installScript: 'scripts/prerequisites/install-ansible.sh',
    },
];
