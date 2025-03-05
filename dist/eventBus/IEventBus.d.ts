import { BaseEvent } from "../contracts/BaseEvent";
/**
 * Generic interface for an event bus.
 * The publish method uses a generic type T that extends the BaseEvent contract.
 */
export interface IEventBus {
    /**
     * Publishes an event.
     * @param event - An event payload conforming to a contract.
     */
    publish<T extends BaseEvent>(event: T, queueName: string): Promise<void>;
}
