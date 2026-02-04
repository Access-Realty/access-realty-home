# MLS Keys Reference

## The Two Types of Agent Identifiers

### 1. Agent MLS ID (Human-Readable)
- **What it is**: The 7-digit ID shown in MLS systems (e.g., "0549418", "0681230")
- **Where to find it**: MLS portal under "Agt ID" (see screenshot from Metrotex)
- **Database column**: `mls_agents.member_mls_id`
- **Listing column**: `mls_listings.list_agent_mls_id`

### 2. Member Key (Hash/UUID)
- **What it is**: Internal hash from Bridge API (e.g., "f0f41567d56826d793512e7742f46dbe")
- **Purpose**: Primary key for joins between tables
- **Database column**: `mls_agents.member_key`
- **Listing column**: `mls_listings.list_agent_key`

## Current Staff MLS IDs (Source of Truth)

| Agent | MLS ID (Agt ID) | Member Key (Hash) |
|-------|-----------------|-------------------|
| Justin Brown | 0549418 | f0f41567d56826d793512e7742f46dbe |
| Cassidy Spilker | 0681230 | ceeee52229e0aec33c3ed4e438be2909 |

## How Our Code Works

### staff table/view
- `staff.member_key` stores the **human-readable MLS ID** (e.g., "0549418")
- Despite the column name, it's NOT the hash!
- This is a data convention, not enforced by FK

### Marketing Site Query Pattern (lib/listings.ts)
```typescript
// We filter by the human-readable MLS ID
query.eq("list_agent_mls_id", agentKey)
```

So when `getListings({ agentKey: "0549418" })` is called:
- It matches `mls_listings.list_agent_mls_id = "0549418"`
- This returns Justin Brown's listings

## Office Keys

| Office | Office MLS ID | Office Key (Hash) |
|--------|---------------|-------------------|
| Access Realty | PRSG01 | f9ade7bc6f5509b67ac0776d255d46dc |

Same pattern:
- `list_office_mls_id` = human-readable ("PRSG01")
- `list_office_key` = hash for joins

## Common Mistakes

1. **Storing wrong MLS ID**: Cassidy had "0588429" but her actual Agt ID is "0681230"
2. **Confusing member_key with member_mls_id**: The hash vs human-readable ID
3. **Using the hash in queries**: Our code uses `list_agent_mls_id`, not `list_agent_key`

## How to Find an Agent's MLS ID

1. Look up agent in MLS portal (Metrotex, NTREIS, etc.)
2. Find the "Agt ID" field - this is `member_mls_id`
3. Use this value in `staff.member_key` for marketing site queries

## Database FK Note

The `profiles.member_key` column has an FK to `mls_agents.member_key` (the hash), but in practice we're storing the human-readable MLS ID. The FK constraint may not be enforced for staff profiles.
