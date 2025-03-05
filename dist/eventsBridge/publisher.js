var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AWSEventBridgeBus } from "../eventBus/AWSEventBridgeBus.js";
export function publishMembershipEvent(eventBusName) {
    return __awaiter(this, void 0, void 0, function* () {
        const region = process.env.AWS_REGION || "ap-southeast-2";
        const eventBus = new AWSEventBridgeBus(eventBusName, region);
        const membershipCreatedEvent = {
            type: "MembershipCreated",
            source: "sera.membership",
            data: {
                user: "test@example.com",
                id: "67890"
            },
        };
        try {
            yield eventBus.publish(membershipCreatedEvent);
            console.log("Membership created event published successfully.");
        }
        catch (error) {
            console.error("Failed to publish membership created event:", error);
        }
    });
}
