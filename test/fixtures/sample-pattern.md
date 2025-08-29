# Sample Pattern

## Pattern Template

```typescript
interface ComponentProps {
  // Props definition
}

export const Component = ({ prop1, prop2 }: ComponentProps) => {
  // Component implementation
  return <div>Sample Component</div>;
};
```

## Usage Example

```typescript
import { Component } from './Component';

const App = () => {
  return <Component prop1="value1" prop2="value2" />;
};
```