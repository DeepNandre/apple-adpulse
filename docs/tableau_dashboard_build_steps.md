# 📊 Step-by-Step Tableau Dashboard Instructions

## **Dashboard 1: Campaign Overview (Start Here)**

### **Phase 1: Data Connection**
1. **Connect to Database:**
   - Open Tableau Desktop
   - Click "PostgreSQL" 
   - Enter connection details from above
   - Navigate to `ad_dashboard` schema

2. **Add Data Sources:**
   - Add `dim_campaign` table
   - Add `dim_date` table  
   - Add `dim_geo` table
   - Add `dim_device` table

### **Phase 2: Create Campaign Summary Sheet**

**Sheet 1: Campaign Distribution**
1. **Create New Worksheet:** "Campaign Types"
2. **Build Visualization:**
   - Drag `Campaign Type` to Columns
   - Drag `Number of Records` to Rows
   - Change mark type to Bar
   - Color: Apple Blue (#007AFF)
   - Sort descending by count
3. **Format:**
   - Remove gridlines
   - White background
   - Apple-style fonts

**Sheet 2: Platform Analysis**
1. **Create New Worksheet:** "Platform Distribution"
2. **Build Pie Chart:**
   - Drag `Platform` to Color
   - Drag `Number of Records` to Angle
   - Use Apple color palette
   - Show percentage labels
3. **Format:**
   - Clean legend positioning
   - Remove chart borders

**Sheet 3: Geographic Coverage**
1. **Create New Worksheet:** "EMEA Coverage"
2. **Build Map:**
   - Drag `Country` to Detail
   - Use filled map
   - Light gray base, Apple Blue data
   - Focus on Europe/EMEA region
3. **Format:**
   - Clean map styling
   - Minimal borders

### **Phase 3: Dashboard Assembly**

**Dashboard Creation:**
1. **New Dashboard:** "Campaign Overview"
2. **Set Size:** 1200 x 800 (desktop)
3. **Layout Structure:**
   ```
   [Hero KPIs Row - 150px height]
   [Chart Row 1 - 300px height] 
   [Chart Row 2 - 350px height]
   ```

**Layout Grid:**
1. **Top Row (Hero Metrics):**
   - 4 text boxes with key numbers
   - Total Campaigns: 50
   - Countries Covered: 20+
   - Platforms Active: 4
   - Campaign Types: 4

2. **Middle Row:**
   - Campaign Types bar chart (50% width)
   - Platform distribution pie chart (50% width)

3. **Bottom Row:**
   - EMEA geographic map (100% width)

### **Phase 4: Apple-Style Formatting**

**Color Application:**
1. **Dashboard Background:** #F2F2F7 (Light Gray)
2. **Chart Colors:** Apple Blue primary
3. **Text Colors:** Apple Black for headers
4. **Accent Colors:** Green for positive metrics

**Typography:**
1. **Dashboard Title:** 24pt Bold
2. **Chart Titles:** 18pt Medium  
3. **Labels:** 14pt Regular
4. **Captions:** 12pt Regular

**Spacing:**
1. **Outer Padding:** 16px all sides
2. **Inner Spacing:** 12px between elements
3. **Card Padding:** 16px internal

## **Dashboard 2: Geographic Analysis**

### **Data Preparation**
1. **Connect to Views:**
   - Use `v_emea_geo_performance` view
   - Add geographic hierarchy

### **Visualizations**
**Sheet 1: Country Performance Map**
- Drag `Country` to Color and Label
- Use Apple Blue gradient
- Size by performance metric

**Sheet 2: City Deep Dive**
- Detailed city-level analysis
- Drill-down capability from country view

**Sheet 3: Regional Trends**
- Time-based geographic performance
- Trend lines by region

## **Dashboard 3: A/B Testing Analysis**

### **Data Sources**
- Use `v_ab_test_performance` view
- Campaign dimension with test variants

### **Key Visualizations**
**Test Results Cards:**
- Control vs. Variant performance
- Statistical significance indicators
- Confidence interval displays

**Performance Lift Metrics:**
- Percentage improvement calculations
- Visual lift indicators
- ROI impact analysis

## **Dashboard 4: Executive Summary**

### **High-Level KPIs**
- Use `v_executive_summary` view
- Focus on business impact metrics

### **Layout**
**Hero Section:**
- 4 key business metrics
- Large, bold numbers
- Color-coded performance indicators

**Trend Analysis:**
- Primary business trend chart
- Apple-style line visualization
- Clean, minimal design

**Geographic Summary:**
- High-level EMEA performance
- Country-level summaries

## **Interactive Features**

### **Filters Setup**
1. **Global Filters:**
   - Date range picker
   - Campaign type selector
   - Platform filter
   - Geographic region filter

2. **Filter Styling:**
   - Apple-style dropdowns
   - Clean, minimal appearance
   - Consistent spacing

### **Actions and Interactivity**
1. **Dashboard Actions:**
   - Click-through from summary to detail
   - Geographic drill-down capability
   - Cross-filtering between charts

2. **Hover Effects:**
   - Subtle highlight states
   - Informative tooltips
   - Apple-style visual feedback

## **Performance Optimization**

### **Data Efficiency**
1. **Use Extracts:** For better performance
2. **Optimize Queries:** Use views for complex calculations
3. **Limit Data:** Focus on relevant date ranges

### **Visual Performance**
1. **Reduce Chart Complexity:** When possible
2. **Optimize Images:** Use vector graphics
3. **Minimize Animations:** Keep subtle and purposeful

## **Publishing & Sharing**

### **Tableau Server/Online**
1. **Publish Dashboards:** To Tableau Server
2. **Set Permissions:** Based on audience
3. **Schedule Refresh:** For live data updates

### **Export Options**
1. **PDF Export:** For presentations
2. **Image Export:** For reports
3. **Data Export:** For further analysis

## **Mobile Optimization**

### **Responsive Design**
1. **Mobile Layout:** Vertical stacking
2. **Touch Interactions:** Finger-friendly sizing
3. **Simplified Views:** Reduce complexity for mobile

### **Testing**
1. **Preview Mobile:** Use Tableau's device preview
2. **Test Interactions:** Ensure touch responsiveness
3. **Optimize Load Times:** For mobile networks

## **Best Practices Summary**

### **Apple Design Principles**
- ✅ Use white space generously
- ✅ Maintain consistent color palette
- ✅ Clean, minimal typography
- ✅ Focus on data clarity
- ✅ Subtle, functional interactions

### **Tableau Best Practices**
- ✅ Use consistent naming conventions
- ✅ Document calculations clearly
- ✅ Optimize for performance
- ✅ Test across devices
- ✅ Keep user experience simple and intuitive 