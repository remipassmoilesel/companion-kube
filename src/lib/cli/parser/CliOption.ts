
export class CliOption {
    public shortname: string;
    public name: string;
    public type: string;
    public description: string;

    constructor(name: string, shortname: string,  type: string, description: string) {
        this.shortname = shortname;
        this.name = name;
        this.type = type;
        this.description = description;
    }
}
