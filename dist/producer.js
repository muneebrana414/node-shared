var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AWSEventBridgeBus } from "./eventBus/AWSEventBridgeBus.js";
function publishMembershipEvent() {
    return __awaiter(this, void 0, void 0, function* () {
        const eventBusName = "membership-event-bus";
        const region = "ap-southeast-2";
        // Create an instance of the event bus using the AWS implementation
        const eventBus = new AWSEventBridgeBus(eventBusName, region);
        // Create a sample event using the contract schema
        const membershipCreatedEvent = {
            type: "MembershipCreated",
            source: "sera.membership",
            data: {
                userId: "12345",
                id: "67890",
                validFrom: new Date().toISOString(),
                validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
        try {
            // Publish the event
            yield eventBus.publish(membershipCreatedEvent);
            console.log("Membership created event published successfully.");
        }
        catch (error) {
            console.error("Failed to publish membership created event:", error);
            // Optionally, implement retry or fallback mechanism
        }
    });
}
// Call the function
publishMembershipEvent().catch(console.error);
