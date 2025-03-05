import { IEventBus } from "./IEventBus";
import { BaseEvent } from "../contracts/BaseEvent";
/**
 * Concrete implementation of IEventBus using AWS EventBridge.
 * Dynamically creates SQS queues and EventBridge rules for event routing.
 */
export declare class AWSEventBridgeBus implements IEventBus {
    private eventBridgeClient;
    private sqsClient;
    private stsClient;
    private eventBusName;
    private region;
    private accountId;
    constructor(eventBusName: string, region: string);
    /**
     * Publishes an event to AWS EventBridge and ensures routing to the specified SQS queue.
     * @param event - The event payload that extends BaseEvent.
     * @param queueName - The target SQS queue name.
     */
    publish<T extends BaseEvent>(event: T, queueName: string): Promise<void>;
    /**
     * Ensures the SQS queue exists and returns its ARN.
     */
    private ensureQueueExists;
    /**
     * Ensures EventBridge rule and target exist for routing events to SQS.
     */
    private ensureRuleAndTarget;
    /**
     * Retrieves the AWS account ID using STS.
     */
    private getAccountId;
    /**
     * Constructs the SQS queue ARN from queue URL.
     */
    private getQueueArn;
}
