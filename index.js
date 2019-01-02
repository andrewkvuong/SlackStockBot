var https = require('https');
var plotly = require('plotly')('andrewkvuong','ov102W3NwLhgFOxyEHaD');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var stream = require('stream');
const uuidv4 = require('uuid/v4');

exports.handler = (event, context, callback) => {
    // Split parameters
    var events = event.body.text.split(" ");
    
    // Return if Help
    if(events[1] == '-help' || events[2] == '-help' || events[0] == '-help' || events[1] == 'help' || events[2] == 'help' || events[0] == 'help' || events[1] == '-h' || events[2] == '-h' || events[0] == '-h')
    {
      var vis = 'ephemeral';
      if(events[1] == '-o' || events[2] == '-o' || events[0] == '-o')
      {
        vis = 'in_channel';
      }
      // Return response
      const response = {
          response_type:vis,
          text: '*Usage:* ```/stock [STOCKNAME] [OPTIONS]\nEX: /stock AMZN 5d -L``` *Options:* \n```-help   Returns information on options and usage of app. \n-T      Returns the current price and difference percentage with no chart.\n-L      Returns data as a line chart. Default value is candlestick chart.\n1d      Returns 1 day of data for requested stock at 5 minute intervals. Default value.\n5d      Returns 5 days of data for requested stock at 30 minute intervals.\n1m      Returns 1 month of data for requested stock at 1 day intervals. \n3m      Returns 3 month of data for requested stock at 1 day intervals. \n6m      Returns 6 month of data for requested stock at 1 week intervals. \n1y      Returns 1 year of data for requested stock at 1 week intervals. \n5y      Returns 5 year of data for requested stock at 1 month intervals.\n\nSource: https://github.com/andrewkvuong/SlackStockBot```'
      };
      callback(null, response);
      return;
    }
    
    // Update URL based on length requested
    let key_name = 'Time Series (5min)';
    var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+events[0]+'&interval=5min&outputsize=compact&apikey=P7IY8YPEHX9CS9A1';
    let days = 1;
    if(events[1] == "-5d" || events[2] == "-5d" || events[1] == "5d" || events[2] == "5d")
    {
      days = 8;
      key_name = 'Time Series (30min)';
      url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+events[0]+'&interval=30min&outputsize=compact&apikey=P7IY8YPEHX9CS9A1';
    }
    else if(events[1] == "-1m" || events[2] == "-1m" || events[1] == "1m" || events[2] == "1m")
    {
      days = 31;
      key_name = 'Time Series (Daily)';
      url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+events[0]+'&apikey=P7IY8YPEHX9CS9A1';
    }
    else if(events[1] == "-3m" || events[2] == "-3m" || events[1] == "3m" || events[2] == "3m")
    {
      days = 92;
      key_name = 'Time Series (Daily)';
      url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+events[0]+'&apikey=P7IY8YPEHX9CS9A1';
    }
    else if(events[1] == "-6m" || events[2] == "-6m" || events[1] == "6m" || events[2] == "6m")
    {
      days = 187;
      key_name = 'Weekly Time Series';
      url = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol='+events[0]+'&apikey=P7IY8YPEHX9CS9A1';
    }
    else if(events[1] == "-1y" || events[2] == "-1y" || events[1] == "1y" || events[2] == "1y")
    {
      days = 372;
      key_name = 'Weekly Time Series';
      url = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol='+events[0]+'&apikey=P7IY8YPEHX9CS9A1';
    }
    else if(events[1] == "-5y" || events[2] == "-5y" || events[1] == "5y" || events[2] == "5y")
    {
      days = 1832;
      key_name = 'Monthly Time Series';
      url = 'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol='+events[0]+'&apikey=P7IY8YPEHX9CS9A1';
    }
    console.log("URL", url);
    
    // Make GET request
    https.get(url, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
      
      // Build data
      var returnData = "";
      res.on('data', (d) => {
        returnData += d;
      });
      
      // Work with data
      res.on('end', function (){
            var stock_data = JSON.parse(returnData);
            let x_axis = [];
            let close = [];
            let high = [];
            let low = [];
            let open = [];
            let prev_close = 0;
            let x_text = [];
            
            // Hack to deal with weekends and closed hours of market
            let pos = 100;
            const oneDay = 24*60*60*1000;
            
            // Loop through data and put into arrays
            for(var i in stock_data[key_name]){
                let firstDate = Date.parse(Object.keys(stock_data[key_name])[0]);
                let secondDate = Date.parse(i);
                
                // Check when to stop
                let diffDays = Math.round(Math.abs((firstDate - secondDate)/(oneDay)));
                if(diffDays > days && days != 1)
                {
                    prev_close = stock_data[key_name][i]['4. close'];
                    break;
                }
                else if(days == 1 && Object.keys(stock_data[key_name])[0].substring(8, 10) != i.substring(8, 10))
                {
                    prev_close = stock_data[key_name][i]['4. close'];
                    break;
                }

                x_axis.push(pos--);
                x_text.push(formatDate(i, days));
                open.push(stock_data[key_name][i]['1. open']);
                high.push(stock_data[key_name][i]['2. high']);
                low.push(stock_data[key_name][i]['3. low']);
                close.push(stock_data[key_name][i]['4. close']);
            }
            
            // Candlestick plot
            var trace1 = {
              x: x_axis,
              close: close,
              decreasing: {line: {color: '#F45432'}}, 
              high: high,
              increasing: {line: {color: '#21CE99'}}, 
              line: {color: 'rgba(31,119,180,1)'}, 
              low: low,
              open: open,
              type: 'candlestick',
            };
            
            // Scatter plot
            var trace2 = {
              type: "scatter",
              mode: "lines",
              x: x_axis,
              y: close,
              line: {width: 3,
              color: 'rgb(127, 166, 238)'},
              
            };

            // Update axis names. (Must do this due to the way plot.ly handles dates for stock data)
            let x_axis_min = [x_axis[0], x_axis[parseInt(x_axis.length/3)], x_axis[parseInt(2*x_axis.length/3)], x_axis[x_axis.length-1]];
            let x_text_min = [x_text[0], x_text[parseInt(x_text.length/3)], x_text[parseInt(2*x_text.length/3)], x_text[x_text.length-1]];
            if(days == 92)
            {
              x_axis_min = [x_axis[0], x_axis[parseInt(x_axis.length/2)], x_axis[x_axis.length-1]];
              x_text_min = [x_text[0], x_text[parseInt(x_text.length/2)], x_text[x_text.length-1]];
            }
            
            // Debug
            console.log("X_AXIS", x_axis_min);
            console.log("X_TEXT", x_text_min);
            console.log("PREV:", prev_close);
            
            // Update text based on positve vs negative
            let diff = close[0]-prev_close;
            let color = diff < 0 ? '#F45432' : '#21CE99';
            let sign = diff < 0 ? '' : '+';
            let percentage = diff*100.00 / prev_close;
            
            if(events[1] == '-T' || events[2] == '-T' || events[1] == '-t' || events[2] == '-t')
            {
                // Return response
                const response = {
                    response_type:'in_channel',
                    text: events[0] + ': $' + Number(close[0]).toFixed(2),
                    attachments:[{text: sign + Number(diff).toFixed(2) + ' ('+ Number(percentage).toFixed(2) + '%)', fallback: 'fallback', color: color}]
                };
                callback(null, response);
                return;
            }
            
            var layout1 = {
              title: "<b>" + events[0] + " - $" + Number(close[0]).toFixed(2)+'</b><br><span style="color: '+ color +'">'+ sign + Number(diff).toFixed(2) + ' ('+ Number(percentage).toFixed(2) + '%)</span></br>',
              titlefont:{
                  family: 'Arial',
                  size:22
              },
              color: "gray",
              font:{
                  family: 'Arial',
                  size: 15,
                  color: 'black'
              },
              xaxis:{rangeslider: {visible: false}, tickvals:x_axis_min, ticktext: x_text_min}
            };
            
            // Create figure
            var figure = events[1] == '-L' || events[2] == '-L' || events[1] == '-l' || events[2] == '-l' ? {'data': [trace2], layout: layout1} : {'data': [trace1], layout: layout1};
            
            // Figure options
          	var imgOpts = {
          		  format: 'jpeg',
          		  width: 900,
          		  height: 600,
                
          	};
        
            // Create image with random name and upload to S3
            var keyName = uuidv4() + '.jpeg';
            plotly.getImage(figure, imgOpts, function (error, imageStream) {
                if (error) console.log ("GET_IMAGE", error);
                imageStream.pipe(uploadFromStream(s3, keyName));
            });
            
            // Return response
            const response = {
                response_type:'in_channel',
                text: events[0],
                attachments: [{title: events[0], title_link: "https://www.google.com/search?q=" + events[0] + "-stock", image_url: 'https://s3.us-east-2.amazonaws.com/slackbot-stockgraphs/'+keyName, fallback: "Required plain-text summary of the attachment."}]
            };
            callback(null, response);
      });
    }).on('error', (err) => {
            console.log("Stock Data Request Error", err);
            const response = {
                text: err,
            };
            callback(null, response);
    });
};

function uploadFromStream(s3, keyName) {
  var pass = new stream.PassThrough();

  var params = {Bucket: "slackbot-stockgraphs", Key: keyName, Body: pass};
  s3.upload(params, function(err, data) {
    console.log(err, data);
  });

  return pass;
}

function formatDate(date_string, days)
{
  //let date = Date.parse(date_string);
  let month = date_string.substring(5, 7);
  let month_names = [];
  month_names['01'] = "Jan";
  month_names['02'] = "Feb";
  month_names['03'] = "Mar";
  month_names['04'] = "Apr";
  month_names['05'] = "May";
  month_names['06'] = "Jun";
  month_names['07'] = "Jul";
  month_names['08'] = "Aug";
  month_names['09'] = "Sep";
  month_names['10'] = "Oct";
  month_names['11'] = "Nov";
  month_names['12'] = "Dec";
  let month_name = month_names[month];

  if(days == 1)
  {
    return date_string.substring(11, 16);
  }
  if(days == 8 || days == 31)
  {
    return month_name + " " + date_string.substring(8, 10);
  }
  if(days == 92 || days == 187 || days == 372)
  {
    return month_name + " " + date_string.substring(0, 4);
  }
  return date_string.substring(0, 4);
}