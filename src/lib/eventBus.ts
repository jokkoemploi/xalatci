type EventCallback = (data?: any) => void;

export type AppEventType =
  | 'INCIDENT_CREATED'
  | 'INCIDENT_UPDATED'
  | 'INCIDENT_DELETED'
  | 'USER_UPDATED'
  | 'PROFILE_UPDATED'
  | 'NEW_NOTIFICATION'
  | 'NEW_MESSAGE'
  | 'LOGIN_SUCCESS'
  | 'LOGOUT'
  | 'TOKEN_REFRESHED'
  | 'SETTINGS_UPDATED';

class EventBus {
  private listeners: Map<AppEventType, Set<EventCallback>> = new Map();

  on(event: AppEventType, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  off(event: AppEventType, callback: EventCallback): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
    }
  }

  emit(event: AppEventType, data?: any): void {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error executing event bus listener for ${event}:`, err);
        }
      });
    }
  }
}

export const eventBus = new EventBus();
