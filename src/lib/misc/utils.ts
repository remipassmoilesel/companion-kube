import {IAppError, IContainsAppErrors} from './IAppError';
import {IKubeApplication} from '../app-config/appConfigTypes';

export async function walkApplications(apps: IKubeApplication[], cb: (app: IKubeApplication) => Promise<any>) {
    const errors: IAppError[] = [];
    for (const app of apps) {
        try {
            await cb(app);
        } catch (error) {
            errors.push({
                app,
                error,
            });
        }
    }

    if (errors.length > 0) {
        const err: IContainsAppErrors = new Error('The following errors occurred: ');
        err.$appErrors = errors;
        throw err;
    }
}
