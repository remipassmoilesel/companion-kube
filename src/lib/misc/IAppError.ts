import {IKubeApplication} from '../app-config/appConfigTypes';

export interface IAppError {
    app: IKubeApplication;
    error: Error;
}

export interface IContainsAppErrors extends Error {
    $appErrors?: IAppError[];
}
