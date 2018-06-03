
export class TestHelpers {

    public static asyncAssertThrows(cb: () => Promise<any>, errorMessage: RegExp): Promise<any> {
        return cb()
            .then(() => {
                throw new Error('Function expected to throw an error');
            })
            .catch((e) => {
                if (e.message.match(/Function expected to throw an error/)){
                    throw e;
                }
                if (e.message.match(errorMessage)) {
                    return Promise.resolve();
                }
                throw new Error(`Error message '${e.message}' does not match '${errorMessage.toString()}'`);
            });
    }

}
