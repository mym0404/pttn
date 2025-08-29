# Day.js Utils

**Language**: typescript

```typescript
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const formatDate = (date: string | Date) => dayjs(date).format('YYYY-MM-DD');
export const formatDateTime = (date: string | Date) => dayjs(date).format('YYYY-MM-DD HH:mm');
export const fromNow = (date: string | Date) => dayjs(date).fromNow();
export const isToday = (date: string | Date) => dayjs(date).isSame(dayjs(), 'day');
```