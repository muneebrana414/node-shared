import { BaseEvent } from "./BaseEvent";
/**
 * Contract for the MembershipCreated event.
 */
export interface MembershipCreatedEvent extends BaseEvent {
    type: "subscription.created";
    data: {
        userId: string;
        id: string;
        validFrom: string;
        validTo: string;
        createdAt: string;
        updatedAt: string;
    };
}
