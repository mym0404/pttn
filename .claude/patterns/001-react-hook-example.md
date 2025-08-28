# React Custom Hook Pattern

This is a reusable React hook pattern for managing async state.

```typescript
const useAsyncState = <T>(asyncFunction: () => Promise<T>) => {
  const [state, setState] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    asyncFunction()
      .then(setState)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { state, loading, error };
};
```