import {IKubeApplication} from './appConfigTypes';
import * as Ajv from 'ajv';

export interface IInvalidApplication {
    app: IKubeApplication;
    errors: Ajv.ErrorObject[];
}

export interface ISortedAppGroup {
    apps: IKubeApplication[];
    serviceApps: IKubeApplication[];
    clusterApps: IKubeApplication[];
}

export interface IRecursiveLoadingResult {
    valid: ISortedAppGroup;
    invalid: IInvalidApplication[];
}


