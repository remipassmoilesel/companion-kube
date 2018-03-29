import {spawn} from 'child_process';
import {Logger} from '../misc/Logger';

export class ScriptRunner {
    private logger = new Logger();

    private execOptions = {};
    private spawn = spawn;

    public run(script: string) {
        return new Promise((resolve, reject) => {

            this.logger.warning('Running script: ' + script);
            const scriptCmd = spawn(script, [], {shell: true});

            scriptCmd.stdout.on('data', (data: any) => {
                process.stdout.write(data.toString());
            });

            scriptCmd.stderr.on('data', (data: any) => {
                process.stdout.write(data.toString());
            });

            scriptCmd.on('close', (code: number) => {
                if (code !== 0) {
                    reject(new Error(`Bad code: ${code}`));
                    return;
                }
                this.logger.info(`Script exited with code ${code}`);
                resolve(code);
            });

            scriptCmd.on('error', (err: Error) => {
                return reject(err);
            });
        });
    }

}
