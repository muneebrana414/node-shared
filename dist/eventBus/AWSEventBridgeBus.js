import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
export class AWSEventBridgeBus {
    eventBridgeClient;
    eventBusName;
    constructor(eventBusName, region) {
        this.eventBusName = eventBusName;
        this.eventBridgeClient = new EventBridgeClient({ region });
    }
    /**
     * Publishes an event to AWS EventBridge with enhanced error handling and tracing
     * @param event - The event payload that extends BaseEvent
     */
    async publish(event) {
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
            const response = await this.eventBridgeClient.send(command);
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
