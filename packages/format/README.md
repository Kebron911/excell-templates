# @str/format

Number, date, currency, and string formatters shared across STR-Tools apps.

Pure functions, zero dependencies. 100% unit-test coverage required.

## Usage

```ts
import { formatCurrency, formatPercent } from '@str/format';

formatCurrency(1234.5);  // "$1,234.50"
formatPercent(0.125);    // "12.5%"
```
