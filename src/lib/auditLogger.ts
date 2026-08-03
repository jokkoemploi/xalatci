import { eventBus } from './eventBus';
import { AuditLogEntry, UserRole } from '../types';

class AuditLogger {
  private logs: AuditLogEntry[] = [];

  public log(action: string, targetResource: string, user: { id: string; name: string; role: UserRole }, details?: string): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      targetResource,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    };

    this.logs.unshift(entry);
    eventBus.emit('SETTINGS_UPDATED', entry);
    console.log('[AuditLogger]', entry);
    return entry;
  }

  public getLogs(): AuditLogEntry[] {
    return this.logs;
  }
}

export const auditLogger = new AuditLogger();
