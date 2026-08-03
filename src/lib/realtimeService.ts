import { eventBus, AppEventType } from './eventBus';

/**
 * RealtimeService abstraction layer
 * Handles connection, event dispatching, and fallback polling or SSE/WebSocket connection.
 */
class RealtimeService {
  private isConnected: boolean = false;
  private sseSource: EventSource | null = null;

  public connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    console.log('[RealtimeService] Connected to realtime event stream.');
  }

  public disconnect(): void {
    if (this.sseSource) {
      this.sseSource.close();
      this.sseSource = null;
    }
    this.isConnected = false;
    console.log('[RealtimeService] Disconnected from realtime event stream.');
  }

  public publish(event: AppEventType, data?: any): void {
    eventBus.emit(event, data);
  }

  public subscribe(event: AppEventType, callback: (data?: any) => void): () => void {
    return eventBus.on(event, callback);
  }
}

export const realtimeService = new RealtimeService();
