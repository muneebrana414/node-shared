export declare abstract class BaseLogger<T> {
    protected readonly logger: T;
    constructor(logger: T);
    getLogger(): T;
}
