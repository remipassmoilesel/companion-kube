export interface IPrerequisite {
    command: string;
    description?: string;
}

export const PREREQUISITES: IPrerequisite[] = [
    {
        command: 'docker',
    },
    {
        command: 'kubectl',
    },
    {
        command: 'helm',
    },
];
