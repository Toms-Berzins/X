import { ref, onValue, off } from 'firebase/database';
import { db } from '../config/firebase';

export interface MetricsData {
  cpuUsage: number;
  memoryUsage: number;
  activeUsers: number;
  requestsPerMinute: number;
  errorRate: number;
  timestamp: number;
}

class MetricsService {
  private metricsRef = ref(db, 'metrics');
  private listeners: Map<string, (data: MetricsData) => void> = new Map();

  subscribeToMetrics(callback: (data: MetricsData) => void): string {
    const listenerId = Math.random().toString(36).substring(7);
    this.listeners.set(listenerId, callback);

    onValue(this.metricsRef, (snapshot) => {
      const data = snapshot.val() as MetricsData;
      callback(data);
    });

    return listenerId;
  }

  unsubscribeFromMetrics(listenerId: string): void {
    if (this.listeners.has(listenerId)) {
      this.listeners.delete(listenerId);
      off(this.metricsRef);
    }
  }

  // Mock function to simulate metrics updates (for development)
  simulateMetricsUpdate(): void {
    const mockData: MetricsData = {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      activeUsers: Math.floor(Math.random() * 1000),
      requestsPerMinute: Math.floor(Math.random() * 500),
      errorRate: Math.random() * 5,
      timestamp: Date.now(),
    };

    // Update Firebase with mock data
    import('firebase/database').then(({ set }) => {
      set(this.metricsRef, mockData);
    });
  }
}

export const metricsService = new MetricsService(); 