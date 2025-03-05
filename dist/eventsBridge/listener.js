var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express, { Router } from "express";
export class EventBridgeListener {
    constructor() {
        this.handlers = {};
        this.router = Router();
        this.router.use(express.json());
        this.router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const events = Array.isArray(req.body) ? req.body : [req.body];
            for (const event of events) {
                const detailType = event["detail-type"];
                if (this.handlers[detailType]) {
                    for (const handler of this.handlers[detailType]) {
                        try {
                            yield handler(event);
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
        }));
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
