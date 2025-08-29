# Icon Component

**Language**: typescript

```typescript
interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

const Icon = ({ name, size = 20, className = '' }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    className={`inline-block ${className}`}
    fill="currentColor"
  >
    <use href={`#icon-${name}`} />
  </svg>
);

// Usage with sprite
const ChevronDown = () => <Icon name="chevron-down" size={16} />;
```
