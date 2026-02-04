# MLS Tables Schema

Database tables synced from the North Texas Real Estate Information Systems (NTREIS) MLS via Bridge Interactive API.

## Tables Overview

| Table | Description | Status |
|-------|-------------|--------|
| `mls_listings` | Property listings from MLS | Active, populated |
| `mls_agents` | Real estate agent/member data | Active, populated |
| `mls_offices` | Brokerage office data | Active, empty |

---

## mls_listings

Main property listings table containing active and historical listings from the MLS.

### Key Columns

#### Identifiers
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `mls_name` | text | MLS source (e.g., "ntreis2") |
| `listing_key` | text | Unique MLS listing key (hash) |
| `listing_key_numeric` | bigint | Numeric listing key |
| `listing_id` | text | Human-readable MLS ID (e.g., "20681282") |
| `parcel_id` | text | Tax parcel identifier |
| `parcel_number` | text | Tax assessor parcel number |

#### Address
| Column | Type | Description |
|--------|------|-------------|
| `unparsed_address` | text | Full address string |
| `street_number` | text | Street number |
| `street_name` | text | Street name |
| `street_suffix` | text | Street type (Street, Drive, etc.) |
| `city` | text | City name |
| `state_or_province` | text | State (TX) |
| `postal_code` | text | ZIP code |
| `county_or_parish` | text | County name |
| `subdivision_name` | text | Subdivision/neighborhood name |

#### Location
| Column | Type | Description |
|--------|------|-------------|
| `latitude` | decimal | GPS latitude |
| `longitude` | decimal | GPS longitude |

#### Property Details
| Column | Type | Description |
|--------|------|-------------|
| `property_type` | text | Type: Residential, Residential Lease, Commercial Sale, Land, etc. |
| `property_sub_type` | text | Subtype: Single Family, Condominium, Townhouse, etc. |
| `bedrooms_total` | integer | Number of bedrooms |
| `bathrooms_full` | integer | Full bathrooms |
| `bathrooms_half` | integer | Half bathrooms |
| `bathrooms_total_decimal` | decimal | Total baths (e.g., 2.5) |
| `living_area` | integer | Square footage |
| `lot_size_acres` | decimal | Lot size in acres |
| `lot_size_sqft` | decimal | Lot size in square feet |
| `year_built` | integer | Year constructed |
| `stories` | integer | Number of stories |
| `stories_total` | integer | Total stories in building |
| `levels` | text | Level description |
| `garage_spaces` | integer | Garage spaces |
| `covered_spaces` | integer | Covered parking spaces |
| `parking_total` | integer | Total parking spaces |
| `fireplaces_total` | integer | Number of fireplaces |
| `pool_private_yn` | boolean | Has private pool |
| `pool_features` | jsonb | Pool feature details |

#### Pricing
| Column | Type | Description |
|--------|------|-------------|
| `list_price` | decimal | Current list price |
| `original_list_price` | decimal | Original list price |
| `previous_list_price` | decimal | Previous list price |
| `concessions` | text | Seller concessions |

#### Status
| Column | Type | Description |
|--------|------|-------------|
| `standard_status` | text | RESO standard status: Active, Pending, Closed, Canceled, etc. |
| `mls_status` | text | MLS-specific status |
| `previous_standard_status` | text | Previous status |

#### Dates
| Column | Type | Description |
|--------|------|-------------|
| `on_market_date` | date | Date listed on market |
| `listing_contract_date` | date | Listing agreement date |
| `status_change_timestamp` | timestamp | Last status change |
| `price_change_timestamp` | timestamp | Last price change |
| `modification_timestamp` | timestamp | Last MLS modification |
| `expiration_date` | date | Listing expiration |
| `cancellation_date` | date | Cancellation date |
| `purchase_contract_date` | date | Contract date (if sold) |

#### Agent/Office References
| Column | Type | Description |
|--------|------|-------------|
| `list_agent_key` | text | Listing agent key (FK to mls_agents) |
| `list_agent_key_numeric` | bigint | Listing agent numeric key |
| `list_agent_mls_id` | text | Listing agent MLS ID |
| `list_office_key` | text | Listing office key |
| `list_office_key_numeric` | bigint | Listing office numeric key |
| `list_office_mls_id` | text | Listing office MLS ID |
| `co_list_agent_key` | text | Co-listing agent key |
| `co_list_agent_key_numeric` | bigint | Co-listing agent numeric key |
| `buyer_agent_key` | text | Buyer's agent key |
| `buyer_agent_key_numeric` | bigint | Buyer's agent numeric key |
| `buyer_office_key` | text | Buyer's office key |
| `buyer_office_key_numeric` | bigint | Buyer's office numeric key |

#### Schools
| Column | Type | Description |
|--------|------|-------------|
| `school_district` | text | School district name |
| `elementary_school` | text | Elementary school |
| `middle_or_junior_school` | text | Middle school |
| `high_school` | text | High school |

#### Descriptions
| Column | Type | Description |
|--------|------|-------------|
| `public_remarks` | text | Public listing description |
| `private_remarks` | text | Agent-only remarks |
| `tax_legal_description` | text | Legal description |
| `tax_block` | text | Tax block |
| `tax_lot` | text | Tax lot |

#### HOA
| Column | Type | Description |
|--------|------|-------------|
| `association_yn` | boolean | Has HOA |
| `association_fee` | decimal | HOA fee amount |
| `association_fee_frequency` | text | Fee frequency (Monthly, Annually) |

#### Media
| Column | Type | Description |
|--------|------|-------------|
| `photo_urls` | jsonb | Array of photo URLs |
| `thumbnail_urls` | jsonb | Array of thumbnail URLs |
| `photos_count` | integer | Number of photos |
| `photos_stored` | boolean | Photos cached locally |
| `photos_stored_at` | timestamp | When photos were cached |

#### Raw Data
| Column | Type | Description |
|--------|------|-------------|
| `bridge_raw_data` | jsonb | Complete raw data from Bridge API |

#### Sync Metadata
| Column | Type | Description |
|--------|------|-------------|
| `synced_at` | timestamp | Last sync timestamp |
| `columns_backfilled_at` | timestamp | Backfill completion timestamp |

### Property Types

- `Residential` - Single family homes for sale
- `Residential Lease` - Rental properties
- `Commercial Sale` - Commercial properties for sale
- `Commercial Lease` - Commercial rentals
- `Land` - Vacant land
- `Residential Income` - Multi-family investment properties

### Standard Statuses

- `Active` - Currently on market
- `Pending` - Under contract
- `Closed` - Sold
- `Canceled` - Listing canceled
- `Expired` - Listing expired
- `Withdrawn` - Temporarily withdrawn

### Counties Covered

Dallas, Tarrant, Collin, Denton, Ellis, Rockwall, Hunt, Kaufman, Johnson, Parker, Hood, Wise, Grayson, Fannin, and surrounding North Texas counties.

---

## mls_agents

Real estate agents and office staff from the MLS.

### Columns

| Column | Type | Description |
|--------|------|-------------|
| `mls_name` | text | MLS source |
| `member_key` | text | Primary key (hash) |
| `member_key_numeric` | bigint | Numeric member key |
| `member_mls_id` | text | MLS member ID |
| `member_status` | text | Active, Inactive |
| `member_type` | text | Agent type (e.g., "Office Staff (OS)") |
| `member_first_name` | text | First name |
| `member_middle_name` | text | Middle name |
| `member_last_name` | text | Last name |
| `member_full_name` | text | Full name |
| `member_name_suffix` | text | Name suffix |
| `member_email` | text | Email address |
| `member_direct_phone` | text | Direct phone |
| `member_mobile_phone` | text | Mobile phone |
| `member_preferred_phone` | text | Preferred contact phone |
| `member_preferred_phone_ext` | text | Phone extension |
| `member_office_phone_ext` | text | Office phone extension |
| `member_fax` | text | Fax number |
| `member_state_license` | text | License number |
| `member_national_association_id` | text | NAR ID |
| `member_state_or_province` | text | State |
| `member_aor` | text | Association of Realtors |
| `office_key` | text | Office key (FK to mls_offices) |
| `office_key_numeric` | bigint | Office numeric key |
| `office_mls_id` | text | Office MLS ID |
| `social_media_linkedin_url_or_id` | text | LinkedIn URL |
| `social_media_website_url_or_id` | text | Website URL |
| `social_media_facebook_url_or_id` | text | Facebook URL |
| `social_media_twitter_url_or_id` | text | Twitter URL |
| `originating_system_name` | text | Source system name |
| `originating_system_id` | text | Source system ID |
| `originating_system_member_key` | text | Source member key |
| `modification_timestamp` | timestamp | Last MLS modification |
| `bridge_modification_timestamp` | timestamp | Bridge API modification |
| `synced_at` | timestamp | Last sync timestamp |

---

## mls_offices

Brokerage office data (currently empty).

### Expected Columns

| Column | Type | Description |
|--------|------|-------------|
| `office_key` | text | Primary key |
| `office_key_numeric` | bigint | Numeric office key |
| `office_mls_id` | text | MLS office ID |
| `office_name` | text | Brokerage name |
| `office_phone` | text | Phone number |
| `office_address` | text | Office address |
| `office_city` | text | City |
| `office_state` | text | State |
| `office_postal_code` | text | ZIP code |

---

## Statistics Use Cases

### Active Listings Count
```sql
SELECT COUNT(*) FROM mls_listings
WHERE standard_status = 'Active';
```

### Average Price by Property Type
```sql
SELECT property_type, AVG(list_price) as avg_price
FROM mls_listings
WHERE standard_status = 'Active'
GROUP BY property_type;
```

### Listings by County
```sql
SELECT county_or_parish, COUNT(*) as count
FROM mls_listings
WHERE standard_status = 'Active'
GROUP BY county_or_parish
ORDER BY count DESC;
```

### Average Days on Market
```sql
SELECT AVG(EXTRACT(DAY FROM NOW() - on_market_date)) as avg_dom
FROM mls_listings
WHERE standard_status = 'Active'
AND on_market_date IS NOT NULL;
```

### Price Distribution
```sql
SELECT
  CASE
    WHEN list_price < 200000 THEN 'Under $200K'
    WHEN list_price < 400000 THEN '$200K-$400K'
    WHEN list_price < 600000 THEN '$400K-$600K'
    WHEN list_price < 1000000 THEN '$600K-$1M'
    ELSE 'Over $1M'
  END as price_range,
  COUNT(*) as count
FROM mls_listings
WHERE standard_status = 'Active'
AND property_type = 'Residential'
GROUP BY price_range;
```

---

## Data Source

- **Provider**: Bridge Interactive (bridgedataoutput.com)
- **MLS**: North Texas Real Estate Information Systems (NTREIS)
- **Coverage**: North Texas / DFW Metroplex
- **Sync Frequency**: Periodic sync via API
