```markdown
# Interactive Apple-Style Ad Performance Dashboard - Backend Implementation Guide

**Version: 1.0**
**Date: June 20, 2025**

This document outlines the backend implementation plan for the Interactive Apple-Style Ad Performance Dashboard project. The focus is on the data engineering pipeline (ETL), data modeling, business logic, security, performance considerations, and providing practical code examples necessary to feed the Tableau visualization layer.

## 1. Document Header

(Included above)

## 2. API Design

While the primary consumption layer (Tableau) connects directly to the data warehouse, an API can serve as an ingestion point for certain data sources, complementing file-based (CSV) uploads.

**2.1 Ingestion API Endpoints**

*   **Endpoint:** `/api/v1/ingest/ad_performance`
    *   **Method:** `POST`
    *   **Description:** Accepts batches of raw ad performance data.
    *   **Authentication:** API Key or Bearer Token required.
    *   **Payload Example:**
        ```json
        [
          {
            "date": "YYYY-MM-DD",
            "campaign_id": "string",
            "ad_group_id": "string",
            "ad_id": "string",
            "platform": "string",
            "geo": "string",
            "device": "string",
            "impressions": 1234,
            "clicks": 56,
            "spend": 78.90,
            "external_conversion_id": "string" // Optional, link to conversion system
          },
          ...
        ]
        ```
*   **Endpoint:** `/api/v1/ingest/web_analytics`
    *   **Method:** `POST`
    *   **Description:** Accepts batches of web analytics session/event data.
    *   **Authentication:** API Key or Bearer Token required.
    *   **Payload Example:**
        ```json
        [
          {
            "timestamp": "YYYY-MM-DD HH:MM:SS",
            "session_id": "string",
            "user_id": "string", // Pseudonymized or anonymous
            "campaign_id": "string", // Linked via UTMs or tracking params
            "source": "string",
            "medium": "string",
            "landing_page": "string",
            "exit_page": "string", // For bounce rate calc
            "page_views": 5,
            "session_duration_seconds": 300
            // Add event data if needed for funnel (e.g., "events": [{"type": "add_to_cart", ...}])
          },
          ...
        ]
        ```
*   **Endpoint:** `/api/v1/ingest/conversions`
    *   **Method:** `POST`
    *   **Description:** Accepts batches of conversion/transaction data.
    *   **Authentication:** API Key or Bearer Token required.
    *   **Payload Example:**
        ```json
        [
          {
            "conversion_timestamp": "YYYY-MM-DD HH:MM:SS",
            "conversion_id": "string",
            "user_id": "string", // Pseudonymized or anonymous
            "campaign_id": "string", // Attributed campaign
            "revenue": 150.75,
            "product_ids": ["string", "string"],
            "num_items": 2,
            "order_value": 150.75 // Explicit AOV field or calculate from revenue/items
          },
          ...
        ]
        ```

**2.2 API Considerations**

*   Rate Limiting to prevent abuse.
*   Input validation to ensure data types and required fields are present.
*   Asynchronous processing: API endpoints should ideally queue data for processing by the ETL pipeline rather than blocking on immediate database writes.

## 3. Data Models

The data warehouse will store cleaned and transformed data, optimized for analytical queries used by Tableau. We'll use a star or snowflake schema approach.

**3.1 Core Tables (Fact Tables)**

*   **`fact_ad_performance`**
    *   `ad_performance_id` (PK, UUID or Serial)
    *   `date_key` (FK to `dim_date`)
    *   `campaign_key` (FK to `dim_campaign`)
    *   `ad_group_key` (FK to `dim_ad_group`)
    *   `geo_key` (FK to `dim_geo`)
    *   `device_key` (FK to `dim_device`)
    *   `impressions` (INT)
    *   `clicks` (INT)
    *   `spend` (DECIMAL)
    *   `attributed_conversions` (INT) - Number of conversions attributed to this ad/date
    *   `attributed_revenue` (DECIMAL) - Revenue from attributed conversions
    *   `etl_timestamp` (TIMESTAMP) - When this record was processed

*   **`fact_web_analytics`**
    *   `web_analytics_id` (PK, UUID or Serial)
    *   `session_start_timestamp` (TIMESTAMP)
    *   `date_key` (FK to `dim_date`)
    *   `user_key` (FK to `dim_user` - if available/pseudonymized)
    *   `campaign_key` (FK to `dim_campaign` - derived from UTMs)
    *   `geo_key` (FK to `dim_geo` - derived from IP or browser)
    *   `device_key` (FK to `dim_device`)
    *   `source_key` (FK to `dim_source_medium`)
    *   `landing_page_key` (FK to `dim_page`)
    *   `exit_page_key` (FK to `dim_page`)
    *   `page_views` (INT)
    *   `session_duration_seconds` (INT)
    *   `is_bounce` (BOOLEAN) - Calculated: `session_duration_seconds` < threshold OR `page_views` = 1 (depending on definition)
    *   `etl_timestamp` (TIMESTAMP)

*   **`fact_conversions`**
    *   `conversion_id` (PK, UUID or Serial - or use source system ID)
    *   `conversion_timestamp` (TIMESTAMP)
    *   `date_key` (FK to `dim_date`)
    *   `user_key` (FK to `dim_user`)
    *   `campaign_key` (FK to `dim_campaign` - attributed)
    *   `revenue` (DECIMAL)
    *   `num_items` (INT)
    *   `order_value` (DECIMAL) - Same as revenue for single item conversions, or sum for multi-item
    *   `etl_timestamp` (TIMESTAMP)

*   **`fact_customer_retention`** (Derived for cohort analysis)
    *   `retention_id` (PK, UUID or Serial)
    *   `acquisition_date_key` (FK to `dim_date`) - Date of first conversion/interaction
    *   `retention_date_key` (FK to `dim_date`) - Date of subsequent conversion/interaction
    *   `user_key` (FK to `dim_user`)
    *   `acquisition_campaign_key` (FK to `dim_campaign`)
    *   `etl_timestamp` (TIMESTAMP)

*   **`fact_funnel_events`** (Derived for funnel analysis)
    *   `funnel_event_id` (PK, UUID or Serial)
    *   `event_timestamp` (TIMESTAMP)
    *   `session_id` (string) - Link to web analytics session
    *   `user_key` (FK to `dim_user`)
    *   `date_key` (FK to `dim_date`)
    *   `campaign_key` (FK to `dim_campaign`)
    *   `funnel_step` (VARCHAR) - e.g., 'View Product', 'Add to Cart', 'Initiate Checkout', 'Purchase'
    *   `etl_timestamp` (TIMESTAMP)

**3.2 Dimension Tables**

*   **`dim_date`**
    *   `date_key` (PK, INT - YYYYMMDD)
    *   `date` (DATE)
    *   `day_of_week` (INT)
    *   `day_name` (VARCHAR)
    *   `month` (INT)
    *   `month_name` (VARCHAR)
    *   `quarter` (INT)
    *   `year` (INT)
    *   `week_of_year` (INT)
    *   `is_weekend` (BOOLEAN)
*   **`dim_campaign`**
    *   `campaign_key` (PK, UUID or Serial)
    *   `source_campaign_id` (VARCHAR) - ID from source system
    *   `campaign_name` (VARCHAR)
    *   `start_date` (DATE)
    *   `end_date` (DATE)
    *   `status` (VARCHAR)
    *   `budget` (DECIMAL)
    *   `campaign_type` (VARCHAR) - e.g., 'Search', 'Social', 'Display'
*   **`dim_ad_group`** (Similar structure to `dim_campaign`)
*   **`dim_geo`**
    *   `geo_key` (PK, UUID or Serial)
    *   `source_geo_id` (VARCHAR)
    *   `country` (VARCHAR)
    *   `region` (VARCHAR)
    *   `city` (VARCHAR)
*   **`dim_device`**
    *   `device_key` (PK, UUID or Serial)
    *   `source_device_id` (VARCHAR)
    *   `device_type` (VARCHAR) - 'Mobile', 'Tablet', 'Desktop'
    *   `operating_system` (VARCHAR)
    *   `browser` (VARCHAR)
*   **`dim_user`** (Pseudonymized)
    *   `user_key` (PK, UUID or Serial)
    *   `source_user_id_hashed` (VARCHAR) - Hashed user ID from source
    *   `first_session_timestamp` (TIMESTAMP)
    *   `first_conversion_timestamp` (TIMESTAMP)
    *   `acquisition_campaign_key` (FK to `dim_campaign`)
    *   `etl_timestamp` (TIMESTAMP)
*   **`dim_source_medium`**
    *   `source_key` (PK, UUID or Serial)
    *   `source` (VARCHAR) - e.g., 'google', 'facebook', 'direct'
    *   `medium` (VARCHAR) - e.g., 'cpc', 'organic', 'referral'
*   **`dim_page`**
    *   `page_key` (PK, UUID or Serial)
    *   `page_url` (VARCHAR)
    *   `page_path` (VARCHAR)

**3.3 Schema Considerations**

*   Use UUIDs for primary keys to avoid dependencies on insertion order and facilitate distributed systems if needed later.
*   Use integer date keys (`YYYYMMDD`) for efficient joins to the date dimension.
*   Implement Slowly Changing Dimensions (SCD) Type 1 for dimension tables like `dim_campaign` if attributes can change.
*   Partition large fact tables (e.g., `fact_ad_performance`, `fact_web_analytics`) by date for performance.

## 4. Business Logic

The core business logic resides within the ETL pipeline, transforming raw data into the structured fact and dimension tables.

**4.1 ETL Process Steps**

1.  **Extraction:**
    *   Read raw data from CSV files, API endpoints, or other sources (e.g., simulated data generator).
    *   Handle different formats and schemas from various sources.
    *   Store raw data temporarily (e.g., landing area in the database or cloud storage).
2.  **Transformation & Cleaning (Python/SQL):**
    *   **Data Validation:** Check for missing values, incorrect data types, inconsistent formats.
    *   **Cleaning:**
        *   Handle missing data (impute or drop).
        *   Standardize text fields (e.g., lowercasing geo names, campaign names).
        *   Convert data types (e.g., strings to numbers, timestamps).
    *   **Anonymization/Pseudonymization:** Hash user IDs, generalize geo data (e.g., city to region).
    *   **Joining/Mapping:**
        *   Join ad performance data with conversion data based on conversion tracking IDs or attribution rules.
        *   Join web analytics data with campaign data based on UTM parameters.
        *   Map raw geo strings to standardized `dim_geo` keys.
        *   Map raw device strings to standardized `dim_device` keys.
        *   Create or lookup dimension keys (`dim_campaign`, `dim_user`, etc.). Use `INSERT ... ON CONFLICT UPDATE` or staging tables for efficient dimension updates.
    *   **Calculation of Derived Fields (ETL or SQL Views):**
        *   Determine `is_bounce` for web analytics.
        *   Calculate `order_value` from conversion items/revenue.
        *   Identify `funnel_step` from event sequences in web analytics.
        *   Determine `acquisition_date` and `acquisition_campaign` for users.
        *   Aggregate granular data to the required grain for fact tables (e.g., daily ad performance metrics by campaign/geo/device).
3.  **Loading:**
    *   Load transformed data into the staging area of the data warehouse.
    *   Perform final data quality checks on staged data.
    *   Use efficient bulk loading methods (e.g., `COPY` command in PostgreSQL, `PUT` then `COPY INTO` in Snowflake).
    *   Move data from staging to final fact and dimension tables. Implement upserts for fact tables (update if record exists, insert if not) or use incremental loading strategies.
    *   Update or insert into dimension tables (handling SCD).
4.  **Post-Load Processing (SQL Views/Materialized Views):**
    *   Create SQL views for common dashboard metrics (e.g., Daily Campaign Summary, Weekly A/B Test Results, Cohort Retention Matrix, Funnel Conversion Rates). This simplifies Tableau queries and centralizes metric definitions.
    *   Consider materialized views for performance on complex or frequently accessed aggregations.

**4.2 Specific Dashboard Logic Handled in ETL/SQL:**

*   **Campaign Trends:** Simple aggregation of `fact_ad_performance` and `fact_web_analytics` by date, campaign, geo, device. Calculate CTR, CVR, ROAS.
*   **A/B Test Performance:** Requires an `experiment_id` or `variant` field in `fact_ad_performance` and `fact_web_analytics`. Aggregate metrics by variant and date. Statistical significance testing *could* be done in backend/SQL but is often left to the analysis layer (Tableau or a separate script). The backend ensures the data structure supports this.
*   **Customer Lifecycle (Cohorts):**
    *   Determine cohort based on user's `acquisition_date` (from `dim_user` or calculated from `fact_conversions`/`fact_web_analytics`).
    *   Join `fact_customer_retention` (or derive on the fly) to count active users/customers in subsequent periods relative to their acquisition date.
    *   SQL views can pre-calculate cohort matrices.
*   **Customer Lifecycle (Funnel):**
    *   Order `fact_funnel_events` by timestamp within session/user.
    *   Identify sequences of events corresponding to funnel steps.
    *   SQL queries calculate conversion rates between steps (e.g., Count(Step N) / Count(Step N-1)).
*   **Geographic Segmentation:** Filtering and grouping fact tables by `dim_geo`. Ensure EMEA regions are correctly mapped and filtered.

## 5. Security

Security measures are critical given the sensitive nature of ad performance and user data.

*   **Data Access:**
    *   Least Privilege Principle: Database users (ETL process, Tableau service account) should only have necessary permissions (ETL: write to staging, read/write to fact/dims; Tableau: read-only on fact/dims/views).
    *   Secure Credentials: Database connection strings and API keys must be stored securely (e.g., environment variables, cloud secret manager). Do not hardcode credentials.
    *   Network Security: Database/Warehouse should be accessible only from trusted IPs (ETL server, authorized analysts). Use VPCs, firewalls, and potentially private endpoints.
*   **Data Security:**
    *   Anonymization/Pseudonymization: Hash or salt sensitive identifiers (user IDs). Aggregate granular data to reduce individual traceability. Generalize geo data.
    *   Encryption: Data should be encrypted at rest in the database/warehouse and in transit (SSL/TLS for API calls and database connections).
    *   Compliance: Adhere to relevant data privacy regulations (e.g., GDPR for EMEA data). Ensure data retention policies are implemented.
*   **API Security:**
    *   Authentication: Use API keys or token-based authentication (`Bearer` tokens).
    *   Authorization: Ensure API keys/tokens have permissions only for the `/ingest` endpoints.
    *   Rate Limiting: Protect against DoS attacks.
    *   Input Validation: Sanitize and validate all incoming data to prevent injection attacks or processing of malicious data.
*   **ETL Hosting Security:**
    *   Secure hosting environment (e.g., private server, secure cloud function/container).
    *   Regular security patching and monitoring.
    *   Limit access to ETL code and logs.

## 6. Performance

Optimizing performance is key for efficient ETL and a responsive Tableau dashboard.

*   **ETL Performance:**
    *   **Batch Processing:** Process data in batches rather than row by row.
    *   **Parallelization:** Run ETL steps or data sources in parallel where possible.
    *   **Efficient Transformations:**
        *   Perform complex joins and aggregations in SQL *after* loading into the warehouse staging area, leveraging the database engine's power.
        *   Optimize Python scripts for data manipulation (e.g., use libraries like Pandas efficiently).
    *   **Bulk Loading:** Use the database's native bulk loading utilities (e.g., `COPY` in PostgreSQL, `PUT`/`COPY INTO` in Snowflake) which are significantly faster than individual `INSERT` statements.
    *   **Incremental Loading:** Process only new or changed data since the last ETL run, rather than reprocessing the entire dataset daily.
    *   **Monitoring:** Implement logging and monitoring to identify slow ETL steps.
*   **Database/Warehouse Performance:**
    *   **Indexing:** Create indexes on columns frequently used in `WHERE` clauses and `JOIN` conditions, especially `date_key`, `campaign_key`, `geo_key`, `user_key`, `session_id`, timestamps.
    *   **Partitioning:** Partition large fact tables by `date_key` or timestamp range. This significantly speeds up queries that filter by date.
    *   **Query Optimization:** Analyze Tableau queries running against the database. Optimize underlying SQL views or tables based on query patterns.
    *   **Materialized Views:** Use materialized views for complex, slow queries that aggregate data heavily and don't need real-time freshness.
    *   **Warehouse Sizing:** Ensure the database/warehouse instance size or Snowflake warehouse tier is appropriate for the data volume and query load. Scale up during heavy ETL or peak dashboard usage if needed.
    *   **Data Types:** Use appropriate data types (e.g., avoid VARCHAR for dates/numbers).
*   **Tableau Performance:** While backend-focused, ensure the data model provided to Tableau is suitable.
    *   Denormalize slightly if beneficial for query speed (e.g., include frequently used campaign name directly in fact table or a wide view).
    *   Ensure necessary aggregations are available in the views or fact tables.

## 7. Code Examples

These examples illustrate key backend functionalities using Python and SQL.

**7.1 Python Snippet: Basic CSV Ingestion & Database Load (using `pandas` and `psycopg2` for PostgreSQL)**

```python
import pandas as pd
import psycopg2
import os
from io import StringIO
import uuid # For generating UUIDs

# Database connection details (replace with your config)
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_NAME = os.environ.get("DB_NAME", "ad_dashboard")
DB_USER = os.environ.get("DB_USER", "user")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "password")
DB_PORT = os.environ.get("DB_PORT", "5432")

def clean_and_transform_ad_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Basic cleaning and transformation for ad performance data.
    In a real scenario, this would involve more complex logic,
    dimension lookups, and potentially joining data sources.
    """
    # Rename columns for clarity and consistency
    df.rename(columns={
        'Date': 'date',
        'Campaign ID': 'source_campaign_id',
        'Impressions': 'impressions',
        'Clicks': 'clicks',
        'Spend': 'spend',
        'Conversions': 'attributed_conversions' # Assuming conversions are already attributed here
        # Add other columns like geo, device, etc.
    }, inplace=True)

    # Data Type Conversion
    df['date'] = pd.to_datetime(df['date']).dt.date # Convert to date object
    df['impressions'] = pd.to_numeric(df['impressions'], errors='coerce').fillna(0).astype(int)
    df['clicks'] = pd.to_numeric(df['clicks'], errors='coerce').fillna(0).astype(int)
    df['spend'] = pd.to_numeric(df['spend'], errors='coerce').fillna(0.0)
    df['attributed_conversions'] = pd.to_numeric(df['attributed_conversions'], errors='coerce').fillna(0).astype(int)

    # Basic Cleaning/Standardization (example for geo)
    if 'Geo' in df.columns:
        df['geo'] = df['Geo'].str.strip().str.upper() # Standardize geo

    # --- Dimension Key Lookups (Simplified example - real ETL would query dim tables) ---
    # In a real scenario, you'd query dim_campaign, dim_geo etc.
    # For this example, let's simulate adding placeholders or deriving simple keys
    df['date_key'] = df['date'].apply(lambda x: int(x.strftime('%Y%m%d')))
    # In reality, look up or insert into dim_campaign and get the campaign_key UUID
    df['campaign_key'] = df['source_campaign_id'].apply(lambda x: uuid.uuid4()) # Placeholder! Replace with actual lookup/insertion
    # Add lookups for geo_key, device_key etc.

    # Select columns for loading into fact table
    # Note: Need to ensure all required fact_ad_performance columns are present or derived
    output_cols = [
        'date_key', 'campaign_key', # ... add other keys
        'impressions', 'clicks', 'spend', 'attributed_conversions',
        # Placeholder for other fact columns like attributed_revenue
    ]
    # Add dummy revenue for demonstration
    df['attributed_revenue'] = df['attributed_conversions'] * 50.0 # Example AOV

    output_cols = [
        'date_key', 'campaign_key', # Replace with actual logic for geo_key, device_key etc.
        'impressions', 'clicks', 'spend', 'attributed_conversions', 'attributed_revenue'
    ]
    # Ensure all output columns exist, create dummies if necessary for example
    for col in output_cols:
        if col not in df.columns:
             # Add dummy/default columns if not derived from source
             if col == 'geo_key': df[col] = uuid.uuid4()
             elif col == 'device_key': df[col] = uuid.uuid4()
             else: df[col] = None # Or a default value

    return df[output_cols] # Return DataFrame with columns mapping to fact_ad_performance


def load_data_to_postgres(df: pd.DataFrame, table_name: str):
    """
    Loads a pandas DataFrame into a PostgreSQL table using COPY FROM.
    More efficient for bulk inserts than individual INSERT statements.
    """
    conn = None
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT
        )
        cursor = conn.cursor()

        # Use StringIO to simulate a file for COPY FROM
        # Prepare data for COPY (tab-separated values, handle nulls)
        output = StringIO()
        df.to_csv(output, sep='\t', header=False, index=False, na_rep='\\N') # Use \N for SQL NULL
        output.seek(0) # Go back to the start of the stream

        # Execute COPY FROM
        # Ensure table columns match DataFrame column order
        # This is a simplified example, column mapping should be explicit
        cols = ', '.join(df.columns)
        copy_sql = f"""
            COPY {table_name} ({cols}) FROM STDIN WITH (FORMAT CSV, DELIMITER '\t', NULL '\\N');
        """

        print(f"Executing COPY to {table_name}...")
        cursor.copy_from(output, table_name, sep='\t', null='\\N')

        conn.commit()
        print(f"Successfully loaded {len(df)} rows into {table_name}")

    except (psycopg2.Error, Exception) as e:
        print(f"Database error: {e}")
        if conn:
            conn.rollback() # Rollback on error
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# --- Example Usage ---
if __name__ == "__main__":
    # Simulate reading from a CSV file
    csv_file_path = 'path/to/your/raw_ad_data.csv' # Replace with actual path or simulate
    # Create a dummy CSV for demonstration if the file doesn't exist
    if not os.path.exists(csv_file_path):
        print(f"Creating dummy CSV: {csv_file_path}")
        dummy_data = {
            'Date': ['2025-06-18', '2025-06-18', '2025-06-19', '2025-06-19'],
            'Campaign ID': ['cmp_a', 'cmp_b', 'cmp_a', 'cmp_b'],
            'Impressions': [1000, 500, 1200, 600],
            'Clicks': [50, 20, 60, 25],
            'Spend': [10.5, 5.2, 12.0, 6.0],
            'Conversions': [5, 1, 7, 2],
            'Geo': ['France', 'Germany', 'Spain', 'Italy'], # Example geo column
            'Device': ['Mobile', 'Desktop', 'Mobile', 'Desktop'] # Example device column
        }
        dummy_df_raw = pd.DataFrame(dummy_data)
        dummy_df_raw.to_csv(csv_file_path, index=False)
        print("Dummy CSV created.")


    try:
        print(f"Reading raw data from {csv_file_path}")
        df_raw = pd.read_csv(csv_file_path)

        print("Cleaning and transforming data...")
        df_transformed = clean_and_transform_ad_data(df_raw.copy()) # Use a copy to avoid modifying original

        print("Loading data to database...")
        # Make sure your 'fact_ad_performance' table exists in your DB
        load_data_to_postgres(df_transformed, 'fact_ad_performance')

    except FileNotFoundError:
        print(f"Error: File not found at {csv_file_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

```

**7.2 SQL Snippet: Example View for Daily Campaign Summary**

This SQL view aggregates the `fact_ad_performance` data to provide daily metrics per campaign, ready for Tableau.

```sql
-- Assumes fact_ad_performance and dim_campaign, dim_date are populated
-- and dim_date has date_key = YYYYMMDD

CREATE OR REPLACE VIEW daily_campaign_summary AS
SELECT
    dd.date AS report_date,
    dc.campaign_name,
    dc.campaign_type,
    fap.geo_key, -- Still use geo_key for linking to dim_geo in Tableau
    fap.device_key, -- Still use device_key for linking to dim_device in Tableau
    SUM(fap.impressions) AS total_impressions,
    SUM(fap.clicks) AS total_clicks,
    SUM(fap.spend) AS total_spend,
    SUM(fap.attributed_conversions) AS total_attributed_conversions,
    SUM(fap.attributed_revenue) AS total_attributed_revenue,
    -- Calculate key metrics
    CASE
        WHEN SUM(fap.impressions) > 0 THEN (SUM(fap.clicks)::DECIMAL / SUM(fap.impressions)) * 100
        ELSE 0
    END AS ctr, -- Click-Through Rate
    CASE
        WHEN SUM(fap.clicks) > 0 THEN (SUM(fap.attributed_conversions)::DECIMAL / SUM(fap.clicks)) * 100
        ELSE 0
    END AS cvr, -- Conversion Rate (Click-based)
     CASE
        WHEN SUM(fap.attributed_conversions) > 0 THEN SUM(fap.attributed_revenue) / SUM(fap.attributed_conversions)
        ELSE 0
    END AS aov, -- Average Order Value (requires conversion data to be joined/aggregated)
    CASE
        WHEN SUM(fap.spend) > 0 THEN (SUM(fap.attributed_revenue)::DECIMAL / SUM(fap.spend)) * 100
        ELSE 0
    END AS roas -- Return on Ad Spend

FROM
    fact_ad_performance fap
JOIN
    dim_date dd ON fap.date_key = dd.date_key
JOIN
    dim_campaign dc ON fap.campaign_key = dc.campaign_key
-- Add joins to dim_geo and dim_device if needed directly in this view,
-- or leave keys for Tableau to join

GROUP BY
    dd.date,
    dc.campaign_name,
    dc.campaign_type,
    fap.geo_key,
    fap.device_key

ORDER BY
    dd.date,
    dc.campaign_name;

-- Example of how to query this view for EMEA geo segmentation
-- Assumes dim_geo has a 'country' column and you link via geo_key
/*
SELECT
    dcs.*,
    dg.country,
    ddim.device_type -- Assuming dim_device has device_type
FROM
    daily_campaign_summary dcs
JOIN
    dim_geo dg ON dcs.geo_key = dg.geo_key
JOIN
    dim_device ddim ON dcs.device_key = ddim.device_key
WHERE
    dg.country IN ('France', 'Germany', 'Spain', 'Italy', 'UK', ...) -- List relevant EMEA countries
    AND dcs.report_date >= 'YYYY-MM-DD' -- Filter by date range
ORDER BY
    dcs.report_date;
*/
```

These examples provide a starting point for the ETL pipeline and data structuring that forms the backbone of the ad performance dashboard. The Python script handles data ingestion and basic transformation, while the SQL view demonstrates how data can be aggregated for consumption by Tableau.

```
