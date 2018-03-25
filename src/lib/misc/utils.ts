import {Logger} from './Logger';
import * as _ from 'lodash';

export function logFatalError(logger: Logger, e: any, debug: boolean){

    logger.error(`Fatal error: ${e.message}`, debug && e.stack);

    if (e.$origins){
        _.forEach(e.$origins, (originErrror) => {
            logger.error(`Caused by: ${originErrror.message}`, debug && originErrror.stack);
        });
    }
}
