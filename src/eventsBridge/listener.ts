import express, { Router, Request, Response } from "express";
import { EventBridgePayload, EventHandler } from "./types.js";

export class EventBridgeListener {
  private handlers: Record<string, EventHandler[]> = {};
  public router: Router = Router();

  constructor() {
    this.router.use(express.json());

    this.router.post("/", async (req: Request, res: Response): Promise<void> => {
      const events: EventBridgePayload[] = Array.isArray(req.body) ? req.body : [req.body];

      for (const event of events) {
        const detailType = event["detail-type"];

        if (this.handlers[detailType]) {
          for (const handler of this.handlers[detailType]) {
            try {
              await handler(event);
            } catch (err) {
              console.error(`Error handling event of type ${detailType}:`, err);
            }
          }
        } else {
          console.log(`No handlers registered for event type: ${detailType}`);
        }
      }

      res.status(200).json({ status: "OK" });
    });
  }

  /**
   * Registers a handler for a given event type.
   */
  public registerHandler(eventType: string, handler: EventHandler) {
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
    }
    this.handlers[eventType].push(handler);
  }
}
