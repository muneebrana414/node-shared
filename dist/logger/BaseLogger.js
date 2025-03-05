export class BaseLogger {
    constructor(logger) {
        this.logger = logger;
    }
    getLogger() {
        return this.logger;
    }
}
