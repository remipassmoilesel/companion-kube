import * as _ from 'lodash';
import {Logger} from './Logger';
import {IAppError, IContainsAppErrors} from './IAppError';
import {IKubeApplication} from '../app-config/appConfigTypes';

export function logFatalError(logger: Logger, e: IContainsAppErrors, debug: boolean) {

    logger.error();
    logger.error(`Fatal error: ${e.message}`, debug && e.stack);
    logger.error();

    if (e.$appErrors) {
        _.forEach(e.$appErrors, (appError: IAppError) => {

            logger.error(
                `Application: ${appError.app.name} \nError: ${appError.error.message}`,
                debug && appError.error.stack,
            );
            logger.error();

        });
    }
}

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