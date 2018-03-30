export interface IPrerequisite {
    command: string;
    description?: string;
    installScript: string;
}

export const PREREQUISITES: IPrerequisite[] = [
    {
        command: 'docker',
        installScript: 'scripts/prereq/install-docker.sh',
    },
    {
        command: 'kubectl',
        installScript: 'scripts/prereq/install-kubectl.sh',
    },
    {
        command: 'helm',
        installScript: 'scripts/prereq/install-helm.sh',
    },
    {
        command: 'ansible',
        installScript: 'scripts/prereq/install-ansible.sh',
    },
];
