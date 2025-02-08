import React, { useEffect, useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { metricsService, MetricsData } from '../../services/metricsService';
import {
  usageTrackingService,
  UsageFilter,
  UsageLogEntry,
} from '../../services/usageTrackingService';

const AdminDashboard: React.FC = () => {
  // State for real-time metrics
  const [metrics, setMetrics] = useState<MetricsData[]>([]);
  const [usageLogs, setUsageLogs] = useState<UsageLogEntry[]>([]);
  const [usageReport, setUsageReport] = useState<any>(null);
  const [filter, setFilter] = useState<UsageFilter>({
    startDate: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
    endDate: Date.now(),
  });

  // Subscribe to real-time metrics
  useEffect(() => {
    const listenerId = metricsService.subscribeToMetrics((data) => {
      setMetrics((prev) => [...prev.slice(-19), data]);
    });

    // Start mock updates for development
    const interval = setInterval(() => {
      metricsService.simulateMetricsUpdate();
    }, 5000);

    return () => {
      metricsService.unsubscribeFromMetrics(listenerId);
      clearInterval(interval);
    };
  }, []);

  // Fetch usage data
  const fetchUsageData = useCallback(async () => {
    const logs = await usageTrackingService.getUsageLogs(filter);
    const report = await usageTrackingService.generateUsageReport(filter);
    setUsageLogs(logs);
    setUsageReport(report);
  }, [filter]);

  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: name.includes('Date') ? new Date(value).getTime() : value,
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Real-time Metrics Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Real-time Performance Metrics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CPU and Memory Usage Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">System Resources</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(time: number) => new Date(time).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label: number) => new Date(label).toLocaleString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="cpuUsage"
                    stroke="#8884d8"
                    name="CPU Usage (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="memoryUsage"
                    stroke="#82ca9d"
                    name="Memory Usage (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Users and Requests Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">User Activity</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(time: number) => new Date(time).toLocaleTimeString()}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    labelFormatter={(label: number) => new Date(label).toLocaleString()}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="#8884d8"
                    name="Active Users"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="requestsPerMinute"
                    stroke="#82ca9d"
                    name="Requests/min"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Analytics Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Usage Analytics</h2>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={new Date(filter.startDate || '').toISOString().slice(0, 16)}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={new Date(filter.endDate || '').toISOString().slice(0, 16)}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <input
                type="text"
                name="userId"
                value={filter.userId || ''}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Filter by user ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Action
              </label>
              <input
                type="text"
                name="action"
                value={filter.action || ''}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Filter by action"
              />
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        {usageReport && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-lg font-medium mb-2">Total Actions</h4>
                <p className="text-3xl font-bold text-indigo-600">
                  {usageReport.totalActions}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-lg font-medium mb-2">Unique Users</h4>
                <p className="text-3xl font-bold text-indigo-600">
                  {usageReport.uniqueUsers}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-lg font-medium mb-2">Most Common Action</h4>
                <p className="text-3xl font-bold text-indigo-600">
                  {Object.entries(usageReport.actionsByType).sort(
                    ([, a], [, b]) => (b as number) - (a as number)
                  )[0]?.[0] || 'N/A'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-lg font-medium mb-2">Peak Hour</h4>
                <p className="text-3xl font-bold text-indigo-600">
                  {Object.entries(usageReport.timeDistribution)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([hour]) => `${hour}:00`)[0] || 'N/A'}
                </p>
              </div>
            </div>

            {/* Actions Distribution Chart */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h3 className="text-lg font-medium mb-4">Actions Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(usageReport.actionsByType).map(([action, count]) => ({
                      action,
                      count,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="action"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Number of Actions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Usage Logs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Path
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usageLogs.map((log, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.path}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard; 