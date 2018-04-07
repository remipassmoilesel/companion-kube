import {IKubeApplication} from '../app-config/appConfigTypes';
import {IInvalidApplication} from '../app-config/configTypes';

export interface IAppError {
    app: IKubeApplication;
    error: Error;
}

export interface IAugmentedError extends Error {
    $appErrors?: IAppError[];
    $invalidApps?: IInvalidApplication[];
}
