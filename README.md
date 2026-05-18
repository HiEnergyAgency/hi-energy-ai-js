# hi-energy-ai — Official JavaScript/TypeScript SDK

Official **JavaScript/TypeScript client** for the [Hi Energy Rocket API](https://staging.hienergyrocket.com/api_documentation) — affiliate marketing data, coupon deals, advertiser discovery, commissions, click reporting, and MCP integration.

| | |
|---|---|
| **npm** | [`hi-energy-ai`](https://www.npmjs.com/package/hi-energy-ai) |
| **Staging API** | `https://staging.hienergyrocket.com/api/v1` |
| **Production API** | `https://app.hienergyrocket.com/api/v1` |
| **Documentation** | [staging.hienergyrocket.com/api_documentation](https://staging.hienergyrocket.com/api_documentation) |
| **Ruby gem** | [HiEnergyAgency/hi_energy_api](https://github.com/HiEnergyAgency/hi_energy_api) |

## Installation

```bash
npm install hi-energy-ai
```

**Requirements:** Node.js **18+** (native `fetch`)

## Quick start

1. Sign in at [Hi Energy Rocket](https://app.hienergyrocket.com) and create an API key on the [API Key page](https://staging.hienergyrocket.com/api_documentation/api_key).
2. Install and call the API:

```typescript
import { Client, PRODUCTION } from "hi-energy-ai";

// Defaults to staging (https://staging.hienergyrocket.com/api/v1)
const client = new Client({ apiKey: process.env.HI_ENERGY_API_KEY! });

// Affiliate advertisers
await client.advertisers.list({ limit: 5 });

// Coupon / promo deals
await client.deals.list({ active: true, country: "US" });

// Universal search
await client.search.query("nike", {
  types: "advertisers,deals",
  per_type_limit: 5,
});

// Prebuilt analytics reports
await client.reports.find("top_advertisers_by_sales", {
  period: "last_90_days",
  limit: 10,
});
```

### Production

```typescript
import { Client, PRODUCTION } from "hi-energy-ai";

const client = new Client({
  apiKey: process.env.HI_ENERGY_API_KEY!,
  baseUrl: PRODUCTION.baseUrl,
  appOrigin: PRODUCTION.appOrigin,
});
```

## Authentication

API key (recommended):

```http
X-Api-Key: YOUR_API_KEY
```

```typescript
const client = new Client({ apiKey: "your_integration_key" });
```

OAuth bearer token:

```typescript
const client = new Client({ bearerToken: process.env.AUTH0_ACCESS_TOKEN! });
```

## API resources

Every method maps to the [API playground](https://staging.hienergyrocket.com/api_documentation):

| Client | HTTP | Use case |
|--------|------|----------|
| `search` | `GET /api/v1/search` | Universal search |
| `deals` | `GET /api/v1/deals` | List and filter deals |
| `advertisers` | `GET /api/v1/advertisers` | Advertiser discovery |
| `advertisers.searchByDomain` | `GET .../search_by_domain` | Lookup by domain |
| `contacts` | `GET`, `POST /api/v1/contacts` | Contact search and create |
| `transactions` | `GET /api/v1/transactions` | Sales and commissions |
| `clicks` | `GET /api/v1/clicks` | Click reporting (date range required) |
| `opportunities` | `GET /api/v1/opportunities` | Publisher opportunities |
| `verticals` | `GET /api/v1/verticals` | Industry categories |
| `tags` | `GET /api/v1/tags` | Tags and tagged advertisers |
| `publishers` | CRUD `/api/v1/publishers` | Publisher accounts |
| `agencies` | `GET /api/v1/agencies` | Agency directory |
| `networks` | `GET /api/v1/networks` | Affiliate networks |
| `reports` | `GET /api/v1/reports` | Analytics reports |
| `users` | `/api/v1/users` | User management |
| `statusChanges` | `GET /api/v1/status_changes` | Approval history |
| `deeplinks` | `POST /api/v1/deeplinks/generate` | Tracking links |
| `domains` | `GET /api/v1/domains/search` | Domain search |
| `tools` | `GET /api/v1/tools` | MCP tool catalog |
| `schema` | `GET /api/v1/schema` | OpenAPI download |
| `exports` | `/api/v1/exports` | Async exports |
| `mcp` | `GET`, `POST /mcp` | MCP bootstrap and JSON-RPC |

## Pagination

List responses include `data` and `meta` (`current_page`, `next_page`, `per_page`, `has_more`):

```typescript
for await (const page of client.paginate("/deals", { limit: 50 })) {
  for (const deal of page.data as unknown[]) {
    // process deal
  }
}
```

## Dry run

Validate wiring without live data:

```typescript
const client = new Client({ apiKey: key, dryRun: true });
await client.deals.list({ active: true });
```

## MCP and AI agents

MCP routes run on the app origin, not under `/api/v1`:

```typescript
await client.mcp.bootstrap();
await client.mcp.integration();
await client.mcp.initializeSession();
await client.mcp.call("tools/list");
```

## Error handling

```typescript
import { HiEnergyError } from "hi-energy-ai";

try {
  await client.advertisers.find(999);
} catch (error) {
  if (error instanceof HiEnergyError) {
    console.error(error.code, error.message, error.requestId, error.status);
  }
}
```

## Development

```bash
git clone https://github.com/HiEnergyAgency/hi-energy-ai-js.git
cd hi-energy-ai-js
npm install
npm test
npm run build
```

## License

MIT — see [LICENSE](LICENSE).

API access requires a Hi Energy Rocket account and API key.
