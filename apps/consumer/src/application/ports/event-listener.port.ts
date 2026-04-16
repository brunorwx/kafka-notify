export interface IEventListener {
  connect(): Promise<void>;
  start(): Promise<void>;
}
