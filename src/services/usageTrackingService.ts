import { ref, push, query, orderByChild, get } from 'firebase/database';
import { db } from '../config/firebase';

export interface UsageLogEntry {
  userId: string;
  action: string;
  path: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface UsageFilter {
  startDate?: number;
  endDate?: number;
  userId?: string;
  action?: string;
}

class UsageTrackingService {
  private logsRef = ref(db, 'usage_logs');

  async logUserAction(entry: Omit<UsageLogEntry, 'timestamp'>): Promise<void> {
    const logEntry: UsageLogEntry = {
      ...entry,
      timestamp: Date.now(),
    };

    await push(this.logsRef, logEntry);
  }

  async getUsageLogs(filter: UsageFilter = {}): Promise<UsageLogEntry[]> {
    const { startDate, endDate, userId, action } = filter;
    
    let baseQuery = query(this.logsRef, orderByChild('timestamp'));
    
    const snapshot = await get(baseQuery);
    if (!snapshot.exists()) return [];

    let logs = Object.values(snapshot.val() as Record<string, UsageLogEntry>);

    // Apply filters
    if (startDate) {
      logs = logs.filter(log => log.timestamp >= startDate);
    }
    if (endDate) {
      logs = logs.filter(log => log.timestamp <= endDate);
    }
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    if (action) {
      logs = logs.filter(log => log.action.includes(action));
    }

    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }

  async generateUsageReport(filter: UsageFilter = {}): Promise<{
    totalActions: number;
    uniqueUsers: number;
    actionsByType: Record<string, number>;
    timeDistribution: Record<string, number>;
  }> {
    const logs = await this.getUsageLogs(filter);
    
    const actionsByType: Record<string, number> = {};
    const userSet = new Set<string>();
    const timeDistribution: Record<string, number> = {};

    logs.forEach(log => {
      // Count actions by type
      actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;
      
      // Track unique users
      userSet.add(log.userId);
      
      // Group by hour for time distribution
      const hour = new Date(log.timestamp).getHours();
      timeDistribution[hour] = (timeDistribution[hour] || 0) + 1;
    });

    return {
      totalActions: logs.length,
      uniqueUsers: userSet.size,
      actionsByType,
      timeDistribution,
    };
  }
}

export const usageTrackingService = new UsageTrackingService(); 