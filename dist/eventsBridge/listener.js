import express, { Router } from "express";
export class EventBridgeListener {
    handlers = {};
    router = Router();
    constructor() {
        this.router.use(express.json());
        this.router.post("/", async (req, res) => {
            const events = Array.isArray(req.body) ? req.body : [req.body];
            for (const event of events) {
                const detailType = event["detail-type"];
                if (this.handlers[detailType]) {
                    for (const handler of this.handlers[detailType]) {
                        try {
                            await handler(event);
                        }
                        catch (err) {
                            console.error(`Error handling event of type ${detailType}:`, err);
                        }
                    }
                }
                else {
                    console.log(`No handlers registered for event type: ${detailType}`);
                }
            }
            res.status(200).json({ status: "OK" });
        });
    }
    /**
     * Registers a handler for a given event type.
     */
    registerHandler(eventType, handler) {
        if (!this.handlers[eventType]) {
            this.handlers[eventType] = [];
        }
        this.handlers[eventType].push(handler);
    }
}
