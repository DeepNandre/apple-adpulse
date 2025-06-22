# Tableau Dashboard Directory

This directory contains the Tableau workbook and related files for the Apple Interactive Ad Performance Dashboard.

## Files

- `dashboard.twb` - Main Tableau workbook (to be created)
- `data_source.tds` - Data source connection file (optional)
- `extracts/` - Directory for Tableau data extracts (if using)

## Dashboard Structure

### Required Tabs/Sheets

1. **Campaign Trends**
   - Time-series analysis of key metrics
   - Interactive date range filtering
   - Campaign performance comparison

2. **A/B Test Performance**
   - Side-by-side variant comparison
   - Statistical significance indicators
   - Conversion rate analysis

3. **Customer Lifecycle**
   - Cohort retention analysis
   - Conversion funnel visualization
   - Customer journey mapping

4. **Geographic Segmentation (EMEA)**
   - Interactive map visualization
   - Country-level performance metrics
   - Regional comparison analysis

### Apple Aesthetic Guidelines

#### Color Palette
- Primary: White (#FFFFFF)
- Secondary: Light Gray (#F5F5F7)
- Accent: Blue (#007AFF)
- Text: Dark Gray (#1D1D1F)
- Success: Green (#30D158)
- Warning: Orange (#FF9500)
- Error: Red (#FF3B30)

#### Typography
- Primary Font: SF Pro Display (or similar clean sans-serif)
- Font Sizes: 
  - Title: 24pt
  - Subtitle: 18pt
  - Body: 14pt
  - Labels: 12pt

#### Layout Principles
- Ample white space
- Clean, minimal design
- Clear visual hierarchy
- Consistent spacing (8px grid)
- Rounded corners (4px radius)

## Data Connection

### PostgreSQL Connection
1. Open Tableau Desktop
2. Connect to PostgreSQL server
3. Server: localhost (or your server)
4. Database: ad_dashboard
5. Schema: ad_dashboard

### Tables to Include
- All dimension tables (dim_*)
- All fact tables (fact_*)
- Dashboard views (v_*)

## Creating the Dashboard

### Step 1: Data Source Setup
1. Connect to PostgreSQL database
2. Drag fact and dimension tables to canvas
3. Create proper relationships
4. Test data connections

### Step 2: Calculated Fields
Create these essential calculated fields:

```tableau
// CTR Percentage
[Clicks] / [Impressions] * 100

// CPA
[Spend] / [Conversions]

// ROAS
[Revenue] / [Spend]

// Bounce Rate Percentage
SUM([Is Bounce]) / COUNT([Session ID]) * 100
```

### Step 3: Build Individual Sheets
1. Create worksheets for each dashboard section
2. Apply Apple aesthetic styling
3. Add appropriate filters and parameters
4. Test interactivity

### Step 4: Create Dashboard
1. Combine worksheets into dashboard
2. Add navigation and filters
3. Implement dashboard actions
4. Test on different screen sizes

### Step 5: Publish
1. Save workbook locally
2. Publish to Tableau Public
3. Test published version
4. Update README with public link

## Performance Optimization

### Best Practices
- Use data extracts for better performance
- Limit data to necessary date ranges
- Use context filters appropriately
- Optimize calculated fields
- Consider using dashboard actions instead of filters

### Data Refresh
- Set up automatic refresh schedule
- Monitor extract size and performance
- Use incremental refresh when possible

## Troubleshooting

### Common Issues
- **Slow performance**: Use extracts, limit date ranges
- **Connection errors**: Check database credentials
- **Missing data**: Verify ETL pipeline completion
- **Styling issues**: Check font availability in Tableau Public

### Getting Help
- Review Tableau documentation
- Check project GitHub issues
- Consult setup guide in docs/ 