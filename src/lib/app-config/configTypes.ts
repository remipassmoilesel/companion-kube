import {IKubeApplication} from './appConfigTypes';
import * as Ajv from 'ajv';

export interface IInvalidApplication {
    app: IKubeApplication;
    errors: Ajv.ErrorObject[];
}

export interface IRecursiveLoadingResult {
    valid: {
        apps: IKubeApplication[],
        serviceApps: IKubeApplication[],
    };
    invalid: IInvalidApplication[];
}


