# Billing System - Frontend Application

A modern, responsive billing and inventory management system built with **Angular 21**, **TypeScript**, **Angular Material**, and **RxJS**.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org))
- **npm** 9+ (comes with Node.js)
- **Angular CLI** 21+ (optional: `npm install -g @angular/cli`)

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open in browser
http://localhost:4201
```

The application will automatically reload when you modify source files.

## 📁 Project Structure

```
src/
├── app/
│   ├── models/                           # TypeScript interfaces & types
│   │   ├── fish.model.ts                # Fish entity
│   │   ├── employee.model.ts            # Employee entity
│   │   ├── expense.model.ts             # Expense entity
│   │   ├── revenue.model.ts             # Revenue entity
│   │   ├── user.model.ts                # User entity
│   │   ├── dashboard.model.ts           # Dashboard metrics
│   │   ├── api-response.model.ts        # Generic API response
│   │   └── index.ts                     # Barrel export
│   │
│   ├── service/                          # API & Business Logic Services
│   │   ├── base-api.service.ts          # Base HTTP service
│   │   ├── fish.service.ts              # Fish API
│   │   ├── employee.service.ts          # Employee API
│   │   ├── expense.service.ts           # Expense API
│   │   ├── revenue.service.ts           # Revenue API
│   │   ├── user.service.ts              # User API
│   │   ├── master-data.service.ts       # Master data API
│   │   ├── dashboard.service.ts         # Dashboard API
│   │   ├── api-endpoints.const.ts       # API endpoint constants
│   │   └── http-error.interceptor.ts    # Global error interceptor
│   │
│   ├── common/
│   │   └── common.service.ts            # Notification service
│   │
│   ├── dashboard/                        # Dashboard module
│   │   ├── dashboard.ts
│   │   ├── dashboard.html
│   │   └── dashboard.css
│   │
│   ├── employee-master/                  # Employee management
│   ├── fish-master/                      # Fish inventory
│   ├── expense/                          # Expense tracking
│   ├── revenue/                          # Revenue tracking
│   ├── login/                            # Authentication
│   ├── layout/                           # Main layout & navigation
│   ├── report/                           # Reports
│   └── [other modules]/                 # Additional features
│
├── environment/
│   ├── environment.ts                    # Development config
│   └── environment.prod.ts               # Production config
│
├── assets/                               # Images, icons, etc.
├── index.html                            # Main HTML
├── main.ts                               # Application entry point
└── styles.css                            # Global styles
```

## 🎯 Core Features

### 📊 Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Key metrics and statistics overview |
| **Employee Master** | Manage employee information |
| **Fish Master** | Inventory management for fish products |
| **Expense** | Track and categorize expenses |
| **Revenue** | Record and analyze revenue |
| **User Management** | Create and manage system users |
| **Reports** | View comprehensive business reports |
| **Profit Report** | Profitability analysis |

### 🎨 UI Components

- **Angular Material** - Professional Material Design components
- **Data Tables** - Sortable, filterable tables
- **Forms** - Reactive forms with validation
- **Date Picker** - Calendar date selection
- **Material Icons** - Comprehensive icon library
- **Notifications** - SweetAlert2 toasts and dialogs

## 🔧 Architecture & Patterns

### Type-Safe Design

All data is strongly typed using TypeScript interfaces in the `/models` directory:

```typescript
// ✅ GOOD: Type-safe request
insertFishdetails(body: CreateFishRequest): Observable<Fish> {
  return this.post<Fish>(url, body);
}

// ❌ AVOID: Using any
insertFishdetails(body: any): Observable<any> {
  return this.http.post<any>(url, body);
}
```

### Service Architecture

**BaseApiService** provides consistent HTTP operations:
```typescript
export class FishService extends BaseApiService {
  getFishdetails(): Observable<Fish[]> {
    return this.get<Fish[]>(this.baseUrl);
  }
}
```

### Centralized API Configuration

All endpoints defined in `api-endpoints.const.ts`:
```typescript
API_ENDPOINTS.FISH.GET_ALL      // '/fish'
API_ENDPOINTS.EMPLOYEE.CREATE   // '/employee'
API_ENDPOINTS.EXPENSE.DELETE    // '/expenseentry'
```

### Component Lifecycle Management

Proper subscription handling prevents memory leaks:

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => { /* handle data */ });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Error Handling

Global error handling + service-level error management:

```typescript
.subscribe({
  next: (data) => { /* success */ },
  error: (err) => {
    this.notificationService.showError('Operation failed');
  }
})
```

## 📋 Form Validation

### Reactive Forms Best Practices

```typescript
this.form = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
});
```

### Available Validators
- `required` - Field must have a value
- `minLength(n)` - Minimum character length
- `min(n)` / `max(n)` - Min/max values
- `email` - Valid email format
- `pattern(regex)` - Matches regex pattern

## 🔔 Notifications Service

Centralized notification handling with SweetAlert2:

```typescript
// Success notification
this.notificationService.showSuccess('Saved successfully');

// Error notification
this.notificationService.showError('An error occurred');

// Info notification
this.notificationService.showInfo('FYI: Important info');

// Warning notification
this.notificationService.showWarning('Warning: Be careful');

// Confirmation dialog
const confirmed = await this.notificationService.showConfirmation(
  'Delete Item',
  'Are you sure you want to delete this?'
);
```

## 🌍 Environment Configuration

### Development (environment.ts)
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',
  apiTimeout: 30000,
  features: {
    enableLogging: true,
    enableAnalytics: false
  }
};
```

### Production (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.yourdomain.com',
  apiTimeout: 30000,
  features: {
    enableLogging: false,
    enableAnalytics: true
  }
};
```

## 🚀 Build & Deployment

### Development
```bash
npm start
# or
ng serve
```

### Production Build
```bash
npm run build
# Output: dist/billing_UI/
```

### Building for Production
```bash
ng build --configuration production
```

## 🧪 Testing

### Unit Tests
```bash
npm test
# or
ng test
```

### E2E Tests
```bash
ng e2e
```

## 📦 Dependencies

### Core
- `@angular/core` - Angular framework
- `@angular/common` - Common utilities
- `@angular/forms` - Reactive forms
- `@angular/router` - Routing

### UI
- `@angular/material` - Material Design components
- `@angular/cdk` - Component dev kit
- `bootstrap` - Bootstrap framework
- `@fortawesome/fontawesome-free` - Font Awesome icons

### State & Async
- `rxjs` - Reactive programming

### Notifications
- `sweetalert2` - Beautiful dialogs and toasts

## 🐛 Troubleshooting

### Port Already in Use
```bash
ng serve --port 4202
```

### Module Not Found
```bash
npm install
# or for compatibility
npm install --legacy-peer-deps
```

### CORS Error
- Verify backend `.env` has correct `CLIENT_URL`
- Check backend is running on port 3000
- Verify `environment.ts` has correct `apiBaseUrl`

### Data Not Loading
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API responses
4. Verify backend is accessible

## 🔒 Security Features

- ✅ Type-safe code (TypeScript)
- ✅ HTTP error handling
- ✅ Input validation
- ✅ Secure environment configuration
- ✅ CORS properly configured
- ✅ No sensitive data in frontend

## 🎓 Code Standards

### File Naming
- Components: `module-name.ts` (kebab-case)
- Services: `module.service.ts`
- Models: `module.model.ts`
- Constants: `*.const.ts`

### Class Naming
- Components: `ModuleNameComponent` (PascalCase)
- Services: `ModuleService`
- Models: `ModuleName` (interface)

### Variable Naming
- Public properties: `camelCase`
- Private properties: `_privateProperty` or `private$`
- Observable subjects: `name$`

## 📚 Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [RxJS Documentation](https://rxjs.dev)
- [Bootstrap Documentation](https://getbootstrap.com/docs)

## 🆘 Need Help?

1. Check browser console for errors
2. Review network requests in DevTools
3. Check backend logs
4. Refer to project documentation
5. Open an issue in the repository

## 📄 License

ISC License

## 🤝 Contributing

1. Follow Angular style guide
2. Use TypeScript strictly
3. Add proper error handling
4. Test components thoroughly
5. Update documentation as needed

---

**Last Updated:** 2024  
**Angular Version:** 21.0.0+  
**Node Version:** 18.0.0+
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
