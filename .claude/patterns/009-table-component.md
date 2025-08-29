# Table Component

**Language**: typescript

```typescript
interface TableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    title: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
  }>;
}

const Table = <T,>({ data, columns }: TableProps<T>) => (
  <table className="w-full border-collapse">
    <thead>
      <tr>
        {columns.map(col => (
          <th key={String(col.key)} className="border p-2 text-left">
            {col.title}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, idx) => (
        <tr key={idx}>
          {columns.map(col => (
            <td key={String(col.key)} className="border p-2">
              {col.render ? col.render(row[col.key], row) : String(row[col.key])}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
```