```markdown
# Product Requirements Document (PRD)

## Document Header

*   **Product Name:** Interactive Apple-Style Ad Performance Dashboard
*   **Version:** 1.0
*   **Date:** June 20, 2025
*   **Author:** [Your Name/Project Team]

## Executive Summary

This document outlines the requirements for developing an interactive ad performance dashboard. The project simulates a real-world marketing analytics scenario, involving data ingestion, ETL, data modeling, and visualization. The final product will be a dynamic dashboard built in Tableau, styled with a clean, minimalist Apple aesthetic, providing insights into campaign performance, A/B tests, customer lifecycle, and geographic trends within the EMEA region, incorporating web analytics metrics similar to Adobe Analytics. The goal is to create a comprehensive portfolio piece demonstrating skills in data engineering (ETL), data analysis (SQL/Python), and data visualization (Tableau), reflecting typical responsibilities of a Data/Marketing Analyst or Data Engineer in a marketing technology context.

## Product Vision

The vision is to create a realistic, end-to-end data analytics project showcasing proficiency across the modern data stack used in marketing. This dashboard will serve as a tangible example of how raw advertising and web data can be transformed into actionable insights for optimizing marketing spend and understanding customer behavior. It aims to empower marketing analysts and managers by providing a single, intuitive source of truth for key performance indicators, facilitating data-driven decision-making and demonstrating the impact of marketing activities on the customer journey and revenue.

*   **Purpose:** To provide a robust, interactive platform for analyzing digital advertising performance and customer behavior, styled for clarity and ease of use.
*   **Users:** Marketing Analysts, Marketing Managers, Data Analysts, Project Evaluators (e.g., Recruiters, Hiring Managers).
*   **Business Goals (Simulated):** Increase marketing ROI, improve conversion rates, understand customer retention drivers, optimize ad spend allocation by campaign and region.

## User Personas

1.  **Persona: Marketing Analyst (Primary User)**
    *   **Goals:** Dive deep into campaign performance, identify underperforming/overperforming segments, analyze A/B test results, understand customer funnel leakage, prepare detailed reports.
    *   **Pain Points:** Sifting through disparate data sources, manual data cleaning, lack of standardized reporting, difficulty correlating ad spend with web behavior metrics, slow access to data.
    *   **Needs from Product:** Granular data visibility, filterable dimensions (campaign, date, geography, test variant), ability to see trends over time, access to underlying data points (if needed), clear and accurate metrics.

2.  **Persona: Marketing Manager (Secondary User)**
    *   **Goals:** Get a quick overview of overall performance, track progress against KPIs, understand regional differences, identify key insights for strategic decisions, review analyst findings.
    *   **Pain Points:** Information overload, dashboards that are too technical or complex, difficulty finding key summary metrics, lack of clear action points derived from data.
    *   **Needs from Product:** Clean and intuitive layout, executive summary views, high-level trend visualizations, clear key performance indicators (KPIs), dashboards that are easy to navigate and understand at a glance.

## Feature Specifications

### 1. Data Simulation & Ingestion

*   **User Story:** As a developer, I need realistic sample ad delivery and web analytics data so I can build and test the ETL pipeline and dashboard features.
*   **Acceptance Criteria:**
    *   CSV file(s) or a documented script to generate CSV file(s) are provided, containing anonymized/simulated data for impressions, clicks, conversions, spend, AOV, retention, bounce rate, session duration, pages per session.
    *   Data includes dimensions like Campaign Name, Ad Group, Creative, Date, Geography (Country/Region within EMEA), User ID (anonymized/hashed), Landing Page URL, A/B Test Variant.
    *   Data volume is sufficient to demonstrate trends and segmentation (e.g., representing a few months of activity for a moderate-sized campaign portfolio).
    *   A Python script is provided to ingest the raw CSV data.
*   **Edge Cases:** Missing values for certain metrics/dimensions; inconsistent naming conventions (e.g., campaign names); unrealistic data points (e.g., 1000% conversion rate); very low data volume for specific segments preventing meaningful analysis.

### 2. ETL Pipeline (Cleaning & Transformation)

*   **User Story:** As a developer, I need an automated and reproducible process to clean, validate, and transform the raw data so it is structured correctly for analysis in the data warehouse.
*   **Acceptance Criteria:**
    *   Python script(s) handle data cleaning (e.g., managing nulls, correcting data types, standardizing formats).
    *   SQL script(s) perform necessary transformations and aggregations (e.g., calculating derived metrics like CPA, CTR, Conversion Rate; joining ad data with web data; calculating AOV per conversion; defining cohort groups based on first activity).
    *   The pipeline logic addresses potential data inconsistencies identified during cleaning.
    *   The transformation logic supports the required dashboard views (e.g., calculating metrics per campaign, per date, per geo, per A/B test variant, per cohort).
*   **Edge Cases:** Data schemas changing unexpectedly; complex logic required for cohort definition (e.g., handling multiple first events); errors in data types causing transformation failures; performance issues with large joins if data volume were scaled up significantly.

### 3. Data Loading (Warehouse)

*   **User Story:** As a developer, I need to load the cleaned and transformed data into a relational database (warehouse) so Tableau can efficiently query it for the dashboard.
*   **Acceptance Criteria:**
    *   Data is loaded into a PostgreSQL database or a mock Snowflake environment (specify which is used).
    *   Database schema is designed appropriately for the analytical queries required by the dashboard (e.g., dimension and fact tables, or a flattened analytical table).
    *   Data types in the database match the transformed data.
    *   The loading process is documented and runnable (e.g., via a Python script).
    *   Basic indexing is applied to frequently used columns (e.g., date, campaign ID, country) to improve query performance.
*   **Edge Cases:** Database connection failures; schema mismatch between ETL output and database tables; insufficient database credentials; storage limitations in the database; slow query performance without proper indexing.

### 4. Tableau Dashboard - Apple Aesthetic

*   **User Story:** As a user, I need a dashboard that is visually appealing, clean, and intuitive to navigate so I can easily find the information I need without distraction.
*   **Acceptance Criteria:**
    *   Dashboard utilizes a minimalist color palette primarily featuring whites, light grays, and limited, consistent accent colors (e.g., a specific blue for primary metrics, a green for positive trends, red for negative).
    *   Typography uses a clean, modern sans-serif font throughout (e.g., simulating San Francisco or using a readily available alternative like Inter, Roboto, or Open Sans).
    *   Layout is clean with ample white space and consistent spacing between elements.
    *   Charts and tables are clear, uncluttered, and easy to read.
    *   Hover actions are used effectively to provide detail on demand without cluttering the main view.
    *   Overall design principles prioritize clarity, simplicity, and focus on the data.
*   **Edge Cases:** Inconsistent application of styles across different sheets; text overlap in charts; poor resolution on different screen sizes; colors not meeting basic accessibility standards (contrast).

### 5. Dashboard Tab - Campaign Trends

*   **User Story:** As a marketing analyst, I need to see how key performance metrics for my campaigns are trending over time so I can monitor performance and identify significant changes.
*   **Acceptance Criteria:**
    *   A dedicated tab exists titled "Campaign Trends" or similar.
    *   Tab displays line charts or area charts showing daily/weekly/monthly trends for key ad metrics: Impressions, Clicks, Spend, Conversions, CPA, CTR, Conversion Rate.
    *   Includes filters allowing users to select specific campaign(s) and define a date range.
    *   Summary cards/KPIs show total performance for the selected period.
    *   Metrics incorporate associated web metrics (e.g., average bounce rate or session duration for traffic generated by the selected campaigns).
*   **Edge Cases:** Data sparsity for specific campaigns/dates leading to broken trend lines; difficulty comparing campaigns with vastly different spend levels on the same axis; impact of filtering on summary KPIs is unclear.

### 6. Dashboard Tab - A/B Test Performance

*   **User Story:** As a marketing analyst, I need to compare the performance of different variants within A/B tests so I can determine the winning creative or targeting approach.
*   **Acceptance Criteria:**
    *   A dedicated tab exists titled "A/B Test Performance" or similar.
    *   Tab displays metrics side-by-side or using comparison charts (e.g., bar charts) for different A/B test variants.
    *   Key metrics compared include Conversion Rate, CPA, CTR, and potentially secondary metrics like Bounce Rate.
    *   A filter is available to select a specific A/B test.
    *   Visualizations clearly highlight the difference in performance between variants.
*   **Edge Cases:** A/B test identifiers are inconsistent in the data; multiple A/B tests ran concurrently impacting results; low sample size for specific variants making comparisons unreliable (though not required to *statistically* test, the visualization should reflect potential data limitations).

### 7. Dashboard Tab - Customer Lifecycle (Cohorts, Funnel)

*   **User Story:** As a marketing analyst or manager, I need to understand how customers behave after their initial interaction and move through the conversion funnel so I can identify drop-off points and measure long-term value (retention/AOV).
*   **Acceptance Criteria:**
    *   A dedicated tab exists titled "Customer Lifecycle" or similar.
    *   Includes a visualization representing the customer conversion funnel (e.g., visualizing steps like Ad Click -> Landing Page Visit -> Conversion -> Purchase). The steps and metrics for each step should be clearly defined.
    *   Includes a basic cohort analysis visualization showing retention (e.g., percentage of users from a specific acquisition cohort who made a repeat purchase or engaged in a subsequent period). Cohorts can be defined by acquisition date/month or campaign.
    *   Filters available for acquisition channel/campaign impacting the funnel or cohort.
*   **Edge Cases:** Ambiguity in defining funnel steps based on available data; limited data points for users making repeat purchases impacting cohort analysis; challenge in linking specific ad clicks directly to subsequent on-site behavior steps without sophisticated tracking simulation.

### 8. Dashboard Tab - Geographic Segmentation (EMEA)

*   **User Story:** As a marketing manager, I need to understand how campaigns are performing in different geographic regions within EMEA so I can allocate budget and tailor messaging effectively.
*   **Accept criteria:**
    *   A dedicated tab exists titled "Geographic Performance" or similar.
    *   Dashboard focuses exclusively on data from countries/regions within EMEA.
    *   Displays key metrics (Impressions, Clicks, Spend, Conversions, CPA) broken down by country or region.
    *   Includes a map visualization of EMEA countries colored by a key performance metric (e.g., CPA or Conversion Rate).
    *   A table view listing performance metrics per country is also provided.
    *   Filters available to drill down into specific countries or sub-regions if applicable in the data.
*   **Edge Cases:** Geographic data granularity is inconsistent (some rows have country, others region); defining which countries constitute "EMEA"; data volume is too low for some smaller countries to show meaningful performance.

### 9. Integration of Web Metrics & Insights

*   **User Story:** As a user, I need to see how user behavior on the website (like bounce rate) correlates with ad campaign performance so I can gain deeper insights into the quality of traffic.
*   **Acceptance Criteria:**
    *   Web analytics metrics (Bounce Rate, Session Duration, Pages per Session - simulated/derived) are present in the underlying data model and accessible in Tableau.
    *   These metrics are integrated into relevant dashboard views (e.g., shown alongside conversion metrics on the Campaign Trends or A/B Test tabs, potentially aggregated by landing page associated with campaigns).
    *   The dashboard design implicitly or explicitly supports the *derivation* of actionable insights (e.g., a chart showing high bounce rate for a high-spend campaign highlights an area for optimization). While the dashboard itself won't *write* insights, its structure should make them obvious.
*   **Edge Cases:** Difficulty accurately associating web sessions/behavior metrics with specific ad clicks/campaigns in the simulated data; web metric definitions differ from standard definitions (need clear documentation).

### 10. Deliverables (GitHub & Deployment)

*   **User Story:** As an evaluator, I need to access the project's code, documentation, and the final dashboard so I can understand the technical implementation and assess the final output.
*   **Acceptance Criteria:**
    *   A public GitHub repository is created containing all source code (Python scripts for ETL, SQL scripts for transformations/schema, Tableau workbook file).
    *   The repository includes a comprehensive README file explaining the project, how to set up the environment, run the ETL pipeline, and connect the dashboard to the data source.
    *   The Tableau dashboard is published to Tableau Public and a link is provided in the README.
    *   Documentation clearly explains the data simulation process and the ETL steps.
    *   Instructions for setting up the database (PostgreSQL or mock Snowflake) are included.
*   **Edge Cases:** Repository is private or inaccessible; required dependencies are not listed; setup instructions are incorrect or incomplete; Tableau Public link is broken; repository is missing key files (e.g., Python scripts); data generation/ingestion is not reproducible.

## Technical Requirements

*   **Data Source:** Simulated or anonymized data provided via CSV files or a Python script generating CSVs.
*   **ETL & Data Processing:** Python (using libraries like `pandas`, database connectors like `psycopg2` for PostgreSQL or `snowflake-connector-python` for Snowflake mock). SQL scripts for transformations and data modeling within the database.
*   **Data Storage:** Relational database (PostgreSQL recommended for accessibility, or a local mock/sample of Snowflake schema/queries).
*   **Visualization Tool:** Tableau Desktop (for creation), Tableau Public (for deployment).
*   **Deployment:**
    *   Code hosted on GitHub (Public Repository).
    *   Dashboard hosted on Tableau Public.
    *   ETL execution: Documented process, potentially runnable locally via script, or simple instructions for simulation. Full cloud hosting of ETL is *not* required unless specifically desired, but reproducibility is key.
*   **Data Volume:** Manageable size for a portfolio project (~10,000 - 100,000 rows across all data files) to demonstrate concepts without requiring significant computational resources.
*   **Dependencies:** Python 3.x, required Python libraries (specified in `requirements.txt` in the repo), Tableau Desktop (user viewing on Public doesn't need Desktop), PostgreSQL database instance (local or cloud) or access to a Snowflake environment/mock.
*   **Security & Privacy:** Data must be simulated or thoroughly anonymized to contain no Personally Identifiable Information (PII).

## Implementation Roadmap

This project can be broken down into phases, building upon completed components.

**Phase 1: Data Foundation & Basic ETL (Approx. 30% of Effort)**

*   Define data schema and structure for simulated data.
*   Generate or create realistic CSV data files.
*   Set up the target database (PostgreSQL or Snowflake mock).
*   Develop Python script for raw data ingestion into a staging area or raw tables.
*   Develop initial Python/SQL scripts for basic cleaning (handling nulls, data types) and loading into base tables in the warehouse.
*   *Deliverables:* Raw data files, database setup instructions, basic ingestion/loading scripts.

**Phase 2: Data Modeling & Core Transformations (Approx. 25% of Effort)**

*   Refine the database schema for analytical queries.
*   Develop SQL scripts for key transformations: calculating core metrics (CPA, CTR, etc.), joining ad and web data, preparing data for main views (campaigns, geo).
*   Implement cohort definition logic in SQL or Python.
*   Implement funnel step definition logic.
*   Ensure data is structured appropriately for efficient querying by Tableau.
*   *Deliverables:* Refined database schema, SQL transformation scripts, documented data model.

**Phase 3: Tableau Dashboard Development - Core Tabs & Aesthetic (Approx. 30% of Effort)**

*   Connect Tableau to the data warehouse.
*   Develop core calculated fields in Tableau.
*   Build the "Campaign Trends" tab.
*   Build the "Geographic Segmentation (EMEA)" tab.
*   Build the "A/B Test Performance" tab.
*   Implement the Apple-style aesthetic across all initial sheets and dashboards (colors, fonts, layout, spacing).
*   *Deliverables:* Tableau workbook with initial tabs, consistent styling applied.

**Phase 4: Advanced Tabs, Web Metrics & Refinement (Approx. 10% of Effort)**

*   Build the "Customer Lifecycle (Cohorts, Funnel)" tab.
*   Integrate simulated web metrics into relevant tabs.
*   Refine existing tabs based on initial review.
*   Ensure interactivity (filters, actions) works correctly.
*   Add titles, tooltips, and annotations for clarity.
*   *Deliverables:* Complete Tableau workbook with all tabs, refined visualizations.

**Phase 5: Documentation & Deployment (Approx. 5% of Effort)**

*   Create a public GitHub repository.
*   Write the comprehensive README file (setup, ETL process, data description, Tableau link).
*   Add all code files (Python, SQL) and the Tableau workbook to the repository.
*   Publish the dashboard to Tableau Public.
*   Verify all links and instructions work correctly.
*   *Deliverables:* Public GitHub repo, Tableau Public link, complete project documentation.

This roadmap allows for iterative development, starting with the data foundation and progressively building the visualization layer while applying the required aesthetic throughout Phase 3 and 4.
```
