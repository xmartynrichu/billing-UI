/**
 * Development Environment Configuration
 */

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',
  apiTimeout: 30000,
  appName: 'Billing System',
  appVersion: '1.0.0',
  features: {
    enableLogging: true,
    enableAnalytics: false,
    enableOfflineMode: false
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100]
  }
};
