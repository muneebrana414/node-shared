var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
export class AWSEventBridgeBus {
    constructor(eventBusName, region) {
        this.eventBusName = eventBusName;
        this.eventBridgeClient = new EventBridgeClient({ region });
    }
    /**
     * Publishes an event to AWS EventBridge with enhanced error handling and tracing
     * @param event - The event payload that extends BaseEvent
     */
    publish(event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateEvent(event);
            const entry = {
                EventBusName: this.eventBusName,
                Source: event.source,
                DetailType: event.type,
                Detail: JSON.stringify(event.data),
                Time: new Date()
            };
            const command = new PutEventsCommand({
                Entries: [entry]
            });
            try {
                const response = yield this.eventBridgeClient.send(command);
                if (response.FailedEntryCount && response.FailedEntryCount > 0) {
                    throw new Error(`Failed to publish event. Failed entries: ${response.FailedEntryCount}`);
                }
                console.log("Event published successfully:", response);
            }
            catch (error) {
                console.error("Error publishing event:", {
                    eventType: event.type,
                    error: error instanceof Error ? error.message : error
                });
                throw error;
            }
        });
    }
    /**
     * Validates the event before publishing
     * @param event - Event to validate
     */
    validateEvent(event) {
        if (!event.source) {
            throw new Error('Event source is required');
        }
        if (!event.type) {
            throw new Error('Event type is required');
        }
        if (!event.data) {
            throw new Error('Event data is required');
        }
    }
}
