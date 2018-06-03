
export type CliOptionType = 'boolean' | 'string';

export class CliOption {
    public shortname: string;
    public name: string;
    public type: CliOptionType;
    public description: string;

    constructor(name: string, shortname: string,  type: CliOptionType, description: string) {
        this.shortname = shortname;
        this.name = name;
        this.type = type;
        this.description = description;
    }
}

export interface ICliOptionValue {
    name: string;
    shortname: string;
    value: boolean | string;
}
