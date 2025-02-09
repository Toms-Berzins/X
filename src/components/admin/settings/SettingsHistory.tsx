import React from 'react';
import { SettingsHistoryEntry, Settings } from '@/hooks/useSettings';
import { format } from 'date-fns';

interface SettingsHistoryProps {
  history: SettingsHistoryEntry[];
}

export const SettingsHistory: React.FC<SettingsHistoryProps> = ({ history }) => {
  const formatChange = (change: any): string => {
    if (typeof change === 'object') {
      return JSON.stringify(change, null, 2);
    }
    return String(change);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Settings History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Changes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {history.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {format(new Date(entry.timestamp), 'PPpp')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {entry.userEmail}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  <div className="space-y-2">
                    {Object.entries(entry.changes).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="font-medium">{key}:</span>
                        <div className="flex gap-2 items-center">
                          <span className="text-red-500 line-through">
                            {formatChange(entry.previousValues[key as keyof Settings])}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">→</span>
                          <span className="text-green-500">
                            {formatChange(value)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 