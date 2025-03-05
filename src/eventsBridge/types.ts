// src/eventListener/types.ts

/**
 * Structure of EventBridge event as sent by AWS via API Destination.
 * If you have a known shape or multiple shapes, you can refine it further.
 */
export interface EventBridgePayload {
  version: string;
  id: string;
  "detail-type": string;
  source: string;
  account: string;
  time: string;
  region: string;
  resources: string[];
  detail: any; // the main payload, shape depends on the event
}

/**
 * Handler function signature. 
 * Receives the event and returns a Promise or void.
 */
export type EventHandler = (event: EventBridgePayload) => Promise<void> | void;
