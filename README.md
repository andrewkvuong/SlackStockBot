# SlackStockBot

Slack application to display stock graphs on Slack given a slash command. Stock data is retrieved from Alpha Vantage and charts are made with plotly for nodejs.

This application is hosted on AWS using AWS Lambda and AWS Gateway API.
Currently being hosted at: https://et9xsm27yf.execute-api.us-east-2.amazonaws.com/Test/getstockgraph
(as of 1/1/2019)

### Usage: 
```
/stock [STOCKNAME] [OPTIONS]
EX: /stock AMZN 5d -L
``` 

### Options:
##### -help
```
Returns information on options and usage of app. 
```
##### -L
```
Returns data as a line chart. Default value is candlestick chart.
```
##### 1d
```Returns 1 day of data for requested stock at 5 minute intervals. Default value.```
##### 5d
```Returns 5 days of data for requested stock at 30 minute intervals.```
##### 1m 
```Returns 1 month of data for requested stock at 1 day intervals.```
##### 3m
```Returns 3 month of data for requested stock at 1 day intervals.```
##### 6m
```Returns 6 month of data for requested stock at 1 week intervals.```
##### 1y
```Returns 1 year of data for requested stock at 1 week intervals.```
##### 5y
```Returns 5 year of data for requested stock at 1 month intervals.```

![Screenshot](slack_exmaple.png)
![Screenshot](chart_exmaple.png)
