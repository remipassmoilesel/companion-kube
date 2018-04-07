import {spawn} from 'child_process';
import {Logger} from '../misc/Logger';

export class ScriptRunner {
    private logger = new Logger();
    private spawn = spawn;

    public run(script: string, scriptArgs: string[]) {
        return new Promise((resolve, reject) => {

            this.logger.warning(`Running script: ${script}`);
            const scriptCmd = this.spawn(script, scriptArgs, {shell: true});

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
                this.logger.info();
                this.logger.info(`Script exited with code ${code}`);
                this.logger.info();
                resolve(code);
            });

            scriptCmd.on('error', (err: Error) => {
                return reject(err);
            });
        });
    }

}
