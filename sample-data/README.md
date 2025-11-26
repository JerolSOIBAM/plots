# Sample Data for Testing

This directory contains sample CSV files for testing the Interactive Plotting App.

## Files

### 1. weather.csv
**Description:** Daily weather data for January 2024
**Columns:**
- `Date` (datetime): Date of observation
- `Temperature` (numeric): Temperature in Celsius
- `Humidity` (numeric): Humidity percentage
- `Rainfall` (numeric): Rainfall in mm
- `WindSpeed` (numeric): Wind speed in km/h

**Suggested Plots:**
- Temperature vs Date (Line)
- Temperature & Humidity vs Date (Multi-line)
- Rainfall vs Date (Bar)
- WindSpeed vs Temperature (Scatter)

### 2. sales.csv
**Description:** Monthly business metrics for 2024
**Columns:**
- `Month` (text): Month name
- `Revenue` (numeric): Monthly revenue in USD
- `Expenses` (numeric): Monthly expenses in USD
- `Profit` (numeric): Monthly profit in USD
- `Customers` (numeric): Number of customers

**Suggested Plots:**
- Revenue vs Month (Line)
- Revenue, Expenses & Profit vs Month (Multi-line)
- Customers vs Month (Bar)
- Profit vs Revenue (Scatter)

## How to Use

### Method 1: File Upload
1. Start the application
2. Click or drag one of these files to the upload zone
3. View the data preview
4. Configure and generate plots

### Method 2: URL Fetch
You can also test with public datasets:

**COVID-19 Data:**
```
https://raw.githubusercontent.com/datasets/covid-19/master/data/time-series-19-covid-combined.csv
```

**Stock Market Data:**
```
https://raw.githubusercontent.com/datasets/finance-vix/master/data/vix-daily.csv
```

**World Population:**
```
https://raw.githubusercontent.com/datasets/population/master/data/population.csv
```

## Creating Your Own Test Data

You can create custom CSV files with:
- Excel (Save As → CSV)
- Google Sheets (File → Download → CSV)
- Python pandas:
```python
import pandas as pd
df = pd.DataFrame({'col1': [1,2,3], 'col2': [4,5,6]})
df.to_csv('custom.csv', index=False)
```
- R:
```r
df <- data.frame(col1=c(1,2,3), col2=c(4,5,6))
write.csv(df, 'custom.csv', row.names=FALSE)
```

## Data Requirements

For best results:
- Include column headers in first row
- Use numeric columns for Y-axis plotting
- Format dates as YYYY-MM-DD or similar
- Avoid special characters in column names
- Keep file size under 100MB
- Use UTF-8 encoding
