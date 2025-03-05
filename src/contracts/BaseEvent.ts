/**
 * Base contract for all events.
 */
export interface BaseEvent {
  type: string;
  source: string;
  data: any;
}
