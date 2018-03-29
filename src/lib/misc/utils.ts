import * as _ from 'lodash';
import * as readline from 'readline';
import {Logger} from './Logger';
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

export function promptUserInput(logger: Logger, question: string, choices: string[]){

    return new Promise((resolve, reject) => {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        logger.question(question);

        rl.question('[' + choices.join(', ') + ']', (answer) => {
            // TODO: Log the answer in a database
            console.log(`Thank you for your valuable feedback: ${answer}`);

            rl.close();
        });

    });

}
