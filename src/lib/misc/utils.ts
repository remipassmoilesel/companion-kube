import {Logger} from './Logger';
import * as _ from 'lodash';
import {IAppError, IContainsAppErrors} from './IAppError';

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

