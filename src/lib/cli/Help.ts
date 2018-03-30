export class Help {

    public static global = `
** Companion-kube **

Mass deployment tool for Kubernetes deployments and charts.
Applications to manage must be described using a ck-config.js file.

`;

    public static init = 'Create a full ck-config.js example. Ck-config file allow to describe a Kubernetes project. ' +
        'In this file you can define scripts, describe Docker build, use deployment options ...';
    public static list = 'List available applications which can be handled by Companion-Kube in current directory. ' +
        'Applications can be service applications or normal applications.';
    public static build = 'Build Docker images of applications.';
    public static script = 'Run script from ck-config.js';

    public static deploy = 'Deploy specified applications. You can name applications by id or by name. ' +
        'If no parameters are specified, current directory is deployed.';
    public static redeploy = 'Destroy then deploy specified applications. You can name applications by id or ' +
        'by name. If no parameters are specified, current directory is redeployed.';
    public static destroy = 'Destroy specified applications. You can name applications by id or ' +
        'by name. If no parameters are specified, current directory is destroyed.';

    public static deployServices = 'Same as deploy but for service applications.';
    public static redeployServices = 'Same as redeploy but for service applications.';
    public static destroyServices = 'Same as destroy but for service applications.';

    public static deployCluster = 'Deploy a Kubernetes cluster with Ansible.';
    public static destroyCluster = 'Remove all Kubernetes software components from a cluster with Ansible.';

}
