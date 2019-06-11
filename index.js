const https = require('https');
const http = require('http');
const plotly = require('plotly')('andrewkvuong', 'ov102W3NwLhgFOxyEHaD');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const stream = require('stream');
const uuidv4 = require('uuid/v4');
const parseString = require('xml2js').parseString;
const h2p = require('html2plaintext');
var request = require('request');
var fs = require('fs')

exports.handler = (event, context, callback) => {
  // Split parameters
  var events = event.body.text.split(" ");
  events[0] = events[0].toLowerCase();
  if (events[0] === 'parrotlet') {
    const response = {
      response_type: 'in_channel',
      attachments: [{ title: events[0], title_link: "https://media.giphy.com/media/LKc35qQgttRu0/giphy.gif", image_url: 'https://media.giphy.com/media/LKc35qQgttRu0/giphy.gif', fallback: events[0] }]
    };
    callback(null, response);
    return;
  }
  else if (events[0] === 'parrotlet2') {
    const response = {
      response_type: 'in_channel',
      attachments: [{ title: events[0], title_link: "https://media.giphy.com/media/LKc35qQgttRu0/giphy.gif", image_url: 'https://media.giphy.com/media/6RIG50yLoWYUM/giphy.gif', fallback: events[0] }]
    };
    callback(null, response);
    return;
  }
  else if (events[0] === 'whale') {
    const response = {
      response_type: 'in_channel',
      attachments: [{ title: events[0], title_link: "https://media.giphy.com/media/LKc35qQgttRu0/giphy.gif", image_url: 'https://media.giphy.com/media/121iTEUa2O49DG/giphy.gif', fallback: events[0] }]
    };
    callback(null, response);
    return;
  }
  else if (event.body.text === 'sleeping parrotlet') {
    const response = {
      response_type: 'in_channel',
      attachments: [{ title: event.body.text, title_link: "https://media.giphy.com/media/3o84TVpkrQ4bRa8VeU/giphy.gif", image_url: 'https://media.giphy.com/media/3o84TVpkrQ4bRa8VeU/giphy.gif', fallback: event.body.text }]
    };
    callback(null, response);
    return;
  }
  else if (events[0] === 'chinchilla') {
    const response = {
      response_type: 'in_channel',
      attachments: [{ title: events[0], title_link: "https://media.giphy.com/media/3o84TVpkrQ4bRa8VeU/giphy.gif", image_url: 'https://media.giphy.com/media/NLIPqilkyziF2/giphy.gif', fallback: "Required plain-text summary of the attachment." }]
    };
    callback(null, response);
    return;
  }
  else if (events[0] === 'raccoon') {
    const response = {
      response_type: 'in_channel',
      attachments: [{ title: events[0], title_link: "https://media.giphy.com/media/3oro5WAV47HEBgdZyS/giphy.gif", image_url: 'https://media.giphy.com/media/3oro5WAV47HEBgdZyS/giphy.gif', fallback: "Required plain-text summary of the attachment." }]
    };
    callback(null, response);
    return;
  }

  // Return if Help
  if (events[1] === '-help' || events[2] === '-help' || events[0] === '-help' || events[1] === 'help' || events[2] === 'help' || events[0] === 'help' || events[1] === '-h' || events[2] === '-h' || events[0] === '-h' || events[0] === '' || events[0] === null) {
    var vis = 'ephemeral';
    if (events[1] === '-o' || events[2] === '-o' || events[0] === '-o') {
      vis = 'in_channel';
    }
    // Return response
    const response = {
      response_type: vis,
      text: '*Usage:* ```/stock [STOCKNAME] [OPTIONS]\nEX: /stock AMZN 5d -L``` *Options:* \n```-help                   Returns information on options and usage of app. \n-yelp [address]\n-dict [word] \n-german [sentence] \n-japanese [sentence] \n-youtube [query] \n-google [query]       Performs google search on query\n[STOCK] -T              Returns the current price and difference percentage with no chart.\n[STOCK] -C              Returns data as a candlestick chart. Default is line chart.\n[STOCK] -news [#]       Displays # news articles from Yahoo finance for given stock. # will default to 3 and maxes at 20.\n-F                      Returns daily values for channel favorite stocks.\n[STOCK] -add            Adds [STOCK] to channel favorite.\n-removeall              Removes all channel favorites\n[STOCK] -V              Returns volume for stock in last 5 minutes\n[STOCK] -daily_volume   Returns daily volume for stock.\n[STOCK] 1d              Returns 1 day of data for requested stock at 5 minute intervals. Default value.\n[STOCK] 5d              Returns 5 days of data for requested stock at 30 minute intervals.\n[STOCK] 1m              Returns 1 month of data for requested stock at 1 day intervals. \n[STOCK] 3m              Returns 3 month of data for requested stock at 1 day intervals. \n[STOCK] 6m              Returns 6 month of data for requested stock at 1 week intervals. \n[STOCK] 1y              Returns 1 year of data for requested stock at 1 week intervals. \n[STOCK] 5y              Returns 5 year of data for requested stock at 1 month intervals.\n\nSource: https://github.com/andrewkvuong/SlackStockBot```'
    };
    callback(null, response);
    return;
  }

  events[0] = events[0].toUpperCase();
  // News
  if(events[0] == '-YELP')
  {
    let offset = 0
    let query = event.body.text.substring(events[0].length+1)
    if(events[1].substring(0, 2) == '-p')
    {
      offset = Number(events[1].substring(2))*5
      query = event.body.text.substring(events[0].length+1+events[1].length+1)
    }
    console.log(query)
    yelp(query, offset, callback)
    return;
  }
  if(events[0] == '-GERMAN')
  {
    let i = 2;
    let flag = false;
    if(events[1] == '-eng')
    {
      i = 3;
      flag = true;
    }
    let query = events[i-1];
    for(i; i < events.length; i++){
      query = query + " " + events[i];
    }
    translate(query, 'de', flag, callback);
    return;
  }
  if(events[0] == '-JAPANESE')
  {
    let i = 2;
    let flag = false;
    if(events[1] == '-eng')
    {
      i = 3;
      flag = true;
    }
    let query = events[i-1];
    for(i; i < events.length; i++){
      query = query + " " + events[i];
    }
    translate(query, 'ja', flag, callback);
    return;
  }
  if(events[0] == '-DICT')
  {
    getInflection(events[1], callback)
    return;
  }
  if(events[0] == '-GOOGLE')
  {
    let i;
    let query = events[1];
    for(i = 2; i < events.length; i++){
      query = query + "+" + events[i];
    }
    google(query, callback);
    return;
  }
  
  if(events[0] == '-POE')
  {
    let i = 2;
    let league = 'Legion'
    let query = events[1];
    if(events[1].charAt(0) == '-')
    {
      league = events[1].substr(1);
      query = events[2]
      i = 3;
    }
    for(i; i < events.length; i++){
      query = query + " " + events[i];
    }
    poe(query, league, callback);
    return;
  }
  
  
  if(events[0] == '-YOUTUBE')
  {
    let i;
    let query = events[1];
    for(i = 2; i < events.length; i++){
      query = query + "+" + events[i];
    }
    youtube(query, callback);
    return;
  }
  
  if (events[1] === '-news') {
    let count = 3;
    if (events[2] != '' && events[2] != null) {
      if (parseInt(events[2]) > 20) {
        count = 20;
      }
      else {
        count = parseInt(events[2]);
      }
    }
    getNews(events[0], count, callback);
    return;
  }
  
  if(events[1] === '-add')
  {
    addFavorites(event.body.channel_id, events[0], callback);
    return;
  }
  
  // Favorites
  if(events[0] === '-f' || events[0] === '-F')
  {
    getFavorites(event.body.channel_id, callback);
    return;
  }
  
  // Remove Favorites
  if(events[0] === '-REMOVEALL')
  {
    removeFavorites(event.body.channel_id, callback);
    return;
  }
  
  // Update URL based on length requested
  let key_name = 'Time Series (5min)';
  var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + events[0] + '&interval=5min&outputsize=compact&apikey=P7IY8YPEHX9CS9A1';
  let days = 1;
  if (events[1] === "-5d" || events[2] === "-5d" || events[1] === "5d" || events[2] === "5d") {
    days = 8;
    key_name = 'Time Series (30min)';
    url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + events[0] + '&interval=30min&outputsize=compact&apikey=P7IY8YPEHX9CS9A1';
  }
  else if (events[1] === "-1m" || events[2] === "-1m" || events[1] === "1m" || events[2] === "1m") {
    days = 31;
    key_name = 'Time Series (Daily)';
    url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + events[0] + '&apikey=P7IY8YPEHX9CS9A1';
  }
  else if (events[1] === "-3m" || events[2] === "-3m" || events[1] === "3m" || events[2] === "3m") {
    days = 92;
    key_name = 'Time Series (Daily)';
    url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + events[0] + '&apikey=P7IY8YPEHX9CS9A1';
  }
  else if (events[1] === "-6m" || events[2] === "-6m" || events[1] === "6m" || events[2] === "6m") {
    days = 187;
    key_name = 'Weekly Time Series';
    url = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=' + events[0] + '&apikey=P7IY8YPEHX9CS9A1';
  }
  else if (events[1] === "-1y" || events[2] === "-1y" || events[1] === "1y" || events[2] === "1y") {
    days = 372;
    key_name = 'Weekly Time Series';
    url = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=' + events[0] + '&apikey=P7IY8YPEHX9CS9A1';
  }
  else if (events[1] === "-5y" || events[2] === "-5y" || events[1] === "5y" || events[2] === "5y") {
    days = 1832;
    key_name = 'Monthly Time Series';
    url = 'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=' + events[0] + '&apikey=P7IY8YPEHX9CS9A1';
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
    res.on('end', function() {
      var stock_data = JSON.parse(returnData);
      let x_axis = [];
      let close = [];
      let high = [];
      let low = [];
      let open = [];
      let prev_close = 0;
      let x_text = [];
      let total_volume = 0;

      // Hack to deal with weekends and closed hours of market
      let pos = 100;
      const oneDay = 24 * 60 * 60 * 1000;

      // Loop through data and put into arrays
      for (var i in stock_data[key_name]) {
        let firstDate = Date.parse(Object.keys(stock_data[key_name])[0]);
        let secondDate = Date.parse(i);

        if (events[1] === '-V' || events[2] === '-V' || events[1] === '-v' || events[2] === '-v') {
          // Return response
          const response = {
            response_type: 'in_channel',
            text: events[0] + ': ' + stock_data[key_name][i]['5. volume'] + ' units in past 5 minutes',
          };
          callback(null, response);
          return;
        }

        total_volume += parseInt(stock_data[key_name][i]['5. volume']);
        console.log("VOLUME", total_volume);
        // Check when to stop
        let diffDays = Math.round(Math.abs((firstDate - secondDate) / (oneDay)));
        if (diffDays > days && days != 1) {
          prev_close = stock_data[key_name][i]['4. close'];
          break;
        }
        else if (days === 1 && Object.keys(stock_data[key_name])[0].substring(8, 10) != i.substring(8, 10)) {
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

      if (events[1] === '-daily_volume' || events[2] === '-daily_volume') {
        // Return response
        const response = {
          response_type: 'in_channel',
          text: events[0] + ': ' + total_volume + ' units',
        };
        callback(null, response);
        return;
      }

      // Candlestick plot
      var trace1 = {
        x: x_axis,
        close: close,
        decreasing: { line: { color: '#F45432' } },
        high: high,
        increasing: { line: { color: '#21CE99' } },
        line: { color: 'rgba(31,119,180,1)' },
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
        line: {
          width: 3,
          color: 'rgb(127, 166, 238)'
        },

      };

      var prev_close_arr = [];
      for (var j = 0; j < close.length; j++) {
        prev_close_arr[j] = prev_close;
      }

      // Prev_close line
      var trace3 = {
        type: "scatter",
        mode: "lines",
        x: x_axis,
        y: prev_close_arr,
        line: {
          width: 1,
          dash: 'dot',
          color: 'gray'
        }
      };

      // Update axis names. (Must do this due to the way plot.ly handles dates for stock data)
      let x_axis_min = [x_axis[0], x_axis[parseInt(x_axis.length / 3)], x_axis[parseInt(2 * x_axis.length / 3)], x_axis[x_axis.length - 1]];
      let x_text_min = [x_text[0], x_text[parseInt(x_text.length / 3)], x_text[parseInt(2 * x_text.length / 3)], x_text[x_text.length - 1]];
      if (days === 92) {
        x_axis_min = [x_axis[0], x_axis[parseInt(x_axis.length / 2)], x_axis[x_axis.length - 1]];
        x_text_min = [x_text[0], x_text[parseInt(x_text.length / 2)], x_text[x_text.length - 1]];
      }

      // Debug
      console.log("X_AXIS", x_axis_min);
      console.log("X_TEXT", x_text_min);
      console.log("PREV:", prev_close);

      // Update text based on positve vs negative
      let diff = close[0] - prev_close;
      let color = diff < 0 ? '#F45432' : '#21CE99';
      let sign = diff < 0 ? '' : '+';
      let percentage = diff * 100.00 / prev_close;

      if (events[1] === '-T' || events[2] === '-T' || events[1] === '-t' || events[2] === '-t') {
        // Return response
        const response = {
          response_type: 'in_channel',
          text: events[0] + ': $' + Number(close[0]).toFixed(2),
          attachments: [{ text: sign + Number(diff).toFixed(2) + ' (' + Number(percentage).toFixed(2) + '%)', fallback: 'fallback', color: color }]
        };
        callback(null, response);
        return;
      }

      var layout1 = {
        title: "<b>" + events[0] + " - $" + Number(close[0]).toFixed(2) + '</b><br><span style="color: ' + color + '">' + sign + Number(diff).toFixed(2) + ' (' + Number(percentage).toFixed(2) + '%)</span></br>',
        titlefont: {
          family: 'Arial',
          size: 22
        },
        color: "gray",
        font: {
          family: 'Arial',
          size: 15,
          color: 'black'
        },
        showlegend: false,
        xaxis: { rangeslider: { visible: false }, tickvals: x_axis_min, ticktext: x_text_min }
      };

      // Create figure
      var figure = events[1] === '-C' || events[2] === '-C' || events[1] === '-c' || events[2] === '-c' ? { 'data': [trace1, trace3], layout: layout1 } : { 'data': [trace2, trace3], layout: layout1 };

      // Figure options
      var imgOpts = {
        format: 'jpeg',
        width: 900,
        height: 600,

      };

      // Create image with random name and upload to S3
      var keyName = uuidv4() + '.jpeg';
      plotly.getImage(figure, imgOpts, function(error, imageStream) {
        if (error) console.log("GET_IMAGE", error);
        imageStream.pipe(uploadFromStream(s3, keyName));
      });

      // Return response
      const response = {
        response_type: 'in_channel',
        text: events[0],
        attachments: [{ title: events[0], title_link: "https://www.google.com/search?q=" + events[0] + "-stock", image_url: 'https://s3.us-east-2.amazonaws.com/slackbot-stockgraphs/' + keyName, fallback: "Required plain-text summary of the attachment." }]
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

  var params = { Bucket: "slackbot-stockgraphs", Key: keyName, Body: pass };
  s3.upload(params, function(err, data) {
    console.log(err, data);
  });

  return pass;
}

function formatDate(date_string, days) {
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

  if (days === 1) {
    return date_string.substring(11, 16);
  }
  if (days === 8 || days === 31) {
    return month_name + " " + date_string.substring(8, 10);
  }
  if (days === 92 || days === 187 || days === 372) {
    return month_name + " " + date_string.substring(0, 4);
  }
  return date_string.substring(0, 4);
}

function getNews(stockName, count, callback) {
  var attachment_arr = [];
  // http://feeds.finance.yahoo.com/rss/2.0/headline?s=ge&region=US&lang=en-US
  let newsURL = 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=' + stockName + '&region=US&lang=en-US';

  https.get(newsURL, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    // Build data
    var returnData = "";
    res.on('data', (d) => {
      returnData += d;
    });

    // Work with data
    res.on('end', function() {
      var data;
      parseString(returnData, function(err, result) {
        data = result;
        if (err) console.log("Parse XML Error:", err);
      });

      var item_arr = data['rss']['channel'][0]['item'];
      for (let i = item_arr.length - 1; i >= item_arr.length - count; i--) {
        let object = { fallback: h2p(item_arr[i]['title'][0]), title: h2p(item_arr[i]['title'][0]), title_link: item_arr[i]['link'][0], text: h2p(item_arr[i]['description']) + '\n_' + item_arr[i]['pubDate'] + "_" };
        attachment_arr.push(object);
      }
      console.log("attachments_arr: ", attachment_arr.length);
      // Return response
      const response = {
        response_type: 'in_channel',
        attachments: attachment_arr
      };
      callback(null, response);
    });
  }).on('error', (err) => {
    console.log("Stock Data Request Error", err);
  });
}

function removeFavorites(channel_id, callback)
{
  let previous_favorites = {Favorites: []};
  let buffer = JSON.stringify(previous_favorites);
  let params = { Bucket: "slackbot-stockgraphs", Key: channel_id, Body: buffer};
  s3.upload(params, (err, data) => {
    if(err) console.log("Upload error", err);
  });
  
  const response = {
    response_type: 'in_channel',
    text: "All favorites removed"
  };
  callback(null, response);
}

function addFavorites(channel_id, stockName, callback)
{
  var params = { Bucket: "slackbot-stockgraphs", Key: channel_id};
  var previous_favorites = {Favorites: []};
  var URL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + stockName + "&apikey=P7IY8YPEHX9CS9A1";
  https.get(URL, (res) => {
      var returnData = "";
      res.on('data', (d) => {
        returnData += d;
      });
  
      // Work with data
      res.on('end', function() {
        let stock_data = JSON.parse(returnData);
        if(JSON.stringify(stock_data['Global Quote']) === '{}')
        {
          const response = {
            response_type: 'in_channel',
            text: "Failed to add: " + stockName
          };
          callback(null, response);
          return;
        }
        s3.getObject(params, (err, data) => {
          if(err){
            console.log("S3 ERROR:", err);
            previous_favorites.Favorites.push(stockName); 
            let buffer = JSON.stringify(previous_favorites);
            params = { Bucket: "slackbot-stockgraphs", Key: channel_id, Body: buffer};
            s3.upload(params, (err, data) => {
              if(err) console.log("Upload error", err);
                const response = {
                  response_type: 'in_channel',
                  text: "Favorites updated: " + previous_favorites.Favorites
                };
                callback(null, response);
                return;
            });
          }
          else
          {
            previous_favorites = JSON.parse(data.Body.toString());
            console.log("S3 DATA", data);
            if(previous_favorites.Favorites.indexOf(stockName) > -1)
            {
              return;
            }
            previous_favorites.Favorites.push(stockName); 
            let buffer = JSON.stringify(previous_favorites);
            params = { Bucket: "slackbot-stockgraphs", Key: channel_id, Body: buffer};
            s3.upload(params, (err, data) => {
              if(err) console.log("Upload error", err);
                const response = {
                  response_type: 'in_channel',
                  text: "Favorites updated: " + previous_favorites.Favorites
                };
                callback(null, response);
            });
          }
        });
      });
  });
}

function getFavorites(channel_id, callback)
{
  var params = { Bucket: "slackbot-stockgraphs", Key: channel_id};
  let favorites;
  s3.getObject(params, (err, data) => {
    if(err) console.log("S3 ERROR:", err);
    //console.log("DATA",  JSON.parse(data.Body.toString()).Favorites);
    favorites = JSON.parse(data.Body.toString());
    
    var promise_arr = [];
    for(var i in favorites.Favorites)
    {
      console.log("STOCK: ", favorites.Favorites[i]);
      var URL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + favorites.Favorites[i] + "&apikey=P7IY8YPEHX9CS9A1";
      promise_arr.push(new Promise(function(resolve, reject){
        https.get(URL, (res) => {
            var returnData = "";
            res.on('data', (d) => {
              returnData += d;
            });
        
            // Work with data
            res.on('end', function() {
              let stock_data = JSON.parse(returnData);
              let color = parseFloat(stock_data['Global Quote']['09. change']) < 0 ? '#F45432' : '#21CE99';
              let sign = parseFloat(stock_data['Global Quote']['09. change']) < 0 ? '' : '+';
              let attachment = {title: stock_data['Global Quote']['01. symbol'] + ': $' + stock_data['Global Quote']['05. price'], text: sign + stock_data['Global Quote']['09. change'] + '(' + sign + stock_data['Global Quote']['10. change percent'] +')', color: color, fallback: stock_data['Global Quote']['01. symbol'] + ': $' + stock_data['Global Quote']['05. price']};
              resolve(attachment);
            });
        });
      }));
    }
  
    Promise.all(promise_arr).then(function(values) {
      const response = {
        response_type: 'in_channel',
        attachments: values
      };
      callback(null, response);
    });
  });
}

function google(query, callback) {
  console.log("Googling")
  var attachment_arr = [];
  let searchURL = "https://www.googleapis.com/customsearch/v1?key=AIzaSyDD0UbdOU29w4oLb3x6bmJQV6kllqXjxuY&cx=017719436008113027189:lmvtrueqorq&q=" + query + "&num=3"
  https.get(searchURL, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    // Build data
    var returnData = "";
    res.on('data', (d) => {
      returnData += d;
    });

    // Work with data
    res.on('end', function() {
      var data;
      let search_data = JSON.parse(returnData);
      
      let i;
      for(i = 0; i < 3; i++){
      
        let title = search_data['items'][i]['title']
        let title_link = search_data['items'][i]['link']
        let display_link = '_' + search_data['items'][i]['displayLink'] + '_'
        let snippet = search_data['items'][i]['snippet'].replace('\n', '')
        
        try{
          let thumbnail = search_data['items'][i]['pagemap']['cse_thumbnail'][0]['src']
          let object = {fallback: title, title: title, title_link: title_link, mrkdown_in: ["text"], thumb_url: thumbnail, text: display_link + "\n" + snippet}
          attachment_arr.push(object)
        }
        catch(err){
          let object = {fallback: title, title: title, title_link: title_link, mrkdown_in: ["text"], text: display_link + "\n" + snippet}
          attachment_arr.push(object)
        }
  
        console.log("attachments_arr: ", attachment_arr.length);
      }
      
      // Return response
      const response = {
        response_type: 'in_channel',
        attachments: attachment_arr
      };
      callback(null, response);
    });
  }).on('error', (err) => {
    console.log("Stock Data Request Error", err);
  });
}

function youtube(query, callback) {
  console.log("youtube")
  var attachment_arr = [];
  let searchURL = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyDD0UbdOU29w4oLb3x6bmJQV6kllqXjxuY&part=snippet&q="+query+"&maxResults=3"
  https.get(searchURL, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    // Build data
    var returnData = "";
    res.on('data', (d) => {
      returnData += d;
    });

    // Work with data
    res.on('end', function() {
      var data;
      let search_data = JSON.parse(returnData);
      
      let i;
      for(i = 0; i < 3; i++){
      
        let title = search_data['items'][i]['snippet']['title']
        let title_link = "https://www.youtube.com/watch?v=" + search_data['items'][i]['id']['videoId']
        let channel = '*' + search_data['items'][i]['snippet']['channelTitle'] + '*'
        let time = '_' + search_data['items'][i]['snippet']['publishedAt'] + '_'
        let desc = search_data['items'][i]['snippet']['description']
        
        try{
          let thumbnail = search_data['items'][i]['snippet']['thumbnails']['default']['url']
          let object = {fallback: title, title: title, title_link: title_link, mrkdown_in: ["text"], thumb_url: thumbnail, text: channel + "\n" + time + "\n" + desc}
          attachment_arr.push(object)
          console.log(object)
        }
        catch(err){
          let object = {fallback: title, title: title, title_link: title_link, mrkdown_in: ["text"], text: channel + "\n" + time + "\n" + desc}
          attachment_arr.push(object)
        }
      }
      
      // Return response
      const response = {
        response_type: 'in_channel',
        attachments: attachment_arr
      };
      callback(null, response);
    });
  }).on('error', (err) => {
    console.log("Stock Data Request Error", err);
  });
}


function dictionary(word, callback) {
  console.log("dictionary")
  var attachment_arr = [];
  let searchURL = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/en/' + word;
  
  var options = {
    hostname: 'od-api.oxforddictionaries.com',
    port: 443,
    path: '/api/v1/entries/en/' + word,
    method: 'GET',
    headers: {Accept: "application/json",
            app_id: "f817ec61",
            app_key: "5299d2379dfb9333417b9ee002e5af5b"}
  };
  
  https.get(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    // Build data
    var returnData = "";
    res.on('data', (d) => {
      returnData += d;
    });

    // Work with data
    res.on('end', function() {
      //var data;
      let data = JSON.parse(returnData);
      //console.log(data['results'][0]['lexicalEntries'][0]['entries'][0]['senses']) // Loop lexical entries

      for(var i = 0; i < data['results'][0]['lexicalEntries'].length; i++)
      {
         let category = data['results'][0]['lexicalEntries'][i]['lexicalCategory']
         let def_text = ''
         console.log(data['results'][0]['lexicalEntries'][i]['entries'][0]['senses'][0]['examples'])
        for(var j = 0; j < data['results'][0]['lexicalEntries'][i]['entries'][0]['senses'].length; j++)
        {
            def_text += j+1 + '. ' + data['results'][0]['lexicalEntries'][i]['entries'][0]['senses'][j]['definitions'][0] + '\n';
            try{
              def_text += '_' + data['results'][0]['lexicalEntries'][i]['entries'][0]['senses'][j]['examples'][0]['text'] + '_\n';
            }
            catch(e)
            {
              console.log('no example')
            }
        }
         let object = {fallback: word, title: category, mrkdown_in:["text"], text: def_text}
         attachment_arr.push(object)
         console.log(object)
      }
      
      
      // Return response
      const response = {
        response_type: 'in_channel',
        text:'*' + word + '*',
        attachments: attachment_arr
      };
      callback(null, response);
    });
  }).on('error', (err) => {
    console.log("Stock Data Request Error", err);
  });
}

function getInflection(word, callback) {
  console.log("dictionary")
  var attachment_arr = [];
  let searchURL = 'https://od-api.oxforddictionaries.com:443/api/v1/inflections/en/' + word;
  
  var options = {
    hostname: 'od-api.oxforddictionaries.com',
    port: 443,
    path: '/api/v1/inflections/en/' + word,
    method: 'GET',
    headers: {Accept: "application/json",
            app_id: "f817ec61",
            app_key: "5299d2379dfb9333417b9ee002e5af5b"}
  };
  
  https.get(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    // Build data
    var returnData = "";
    res.on('data', (d) => {
      returnData += d;
    });

    // Work with data
    res.on('end', function() {
      //var data;
      let data = JSON.parse(returnData);
      //console.log(data['results'][0]['lexicalEntries'][0]['entries'][0]['senses']) // Loop lexical entries
      console.log(data['results'][0]['lexicalEntries'][0]['inflectionOf'][0]['text'])
      dictionary(data['results'][0]['lexicalEntries'][0]['inflectionOf'][0]['text'], callback)
      
    });
  }).on('error', (err) => {
    console.log("Stock Data Request Error", err);
  });
}

function translate(query, language, flag, callback) {
  var attachment_arr = [];
  let searchURL = 'https://api.mymemory.translated.net/get?q='+query+'&langpair=en|'+language;
  if(flag)
    searchURL = 'https://api.mymemory.translated.net/get?q='+query+'&langpair='+language+'|en';
  https.get(searchURL, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    // Build data
    var returnData = "";
    res.on('data', (d) => {
      returnData += d;
    });

    // Work with data
    res.on('end', function() {
      var data;
      let search_data = JSON.parse(returnData);
      
      console.log(search_data['responseData']['translatedText'])
      let translated = search_data['responseData']['translatedText']
      let object = {fallback: translated, title: query, mrkdown_in: ["text"], text: translated}
      attachment_arr.push(object)
      
      // Return response
      const response = {
        response_type: 'in_channel',
        attachments: attachment_arr
      };
      callback(null, response);
    });
  }).on('error', (err) => {
    console.log("Stock Data Request Error", err);
  });
}

function yelp(query, offset, callback) {
  var attachment_arr = [];
  let searchURL = 'https://api.yelp.com/v3/businesses/search?term=restaurant&location='+query+'&sort_by=review_count&limit=5&offset=' + offset
  query = encodeURI(query)
    console.log(query)
  
    var options = {
    hostname: 'api.yelp.com',
    port: 443,
    path: '/v3/businesses/search?term=restaurant&location='+query+'&sort_by=review_count&limit=5&offset=' + offset,
    method: 'GET',
    headers: {Authorization: "Bearer tG8HN_dsRtC-jVV_Tik2x-k_etZ4vQAR9PytnOxtknmIps1Jd9QCf3SJmMpMzszeuUdgMoZQf_AiMhahsgePHmLxVchoJaS4J4Zo9vlvNjL47PBHMte0ltYOORCdXHYx"}
  };
  
  https.get(options, (res) => {

    // Build data
    var returnData = "";
    res.on('data', (d) => {
      returnData += d;
    });

    // Work with data
    res.on('end', function() {
      var data;
      let search_data = JSON.parse(returnData);
      
      console.log(search_data['businesses'][0])
      for(let i = 0; i < search_data['businesses'].length; i++)
      {
        let reviews = search_data['businesses'][i]['review_count']
        let categories = ""
        for(let j = 0; j < search_data['businesses'][i]['categories'].length; j++)
        {
          categories += search_data['businesses'][i]['categories'][j]['title'] + " "
        }
        let location = search_data['businesses'][i]['location']['display_address']
        let rating = search_data['businesses'][i]['rating']
        let final_text = '_' + location.toString() + '_\n_' + categories + '_\n' + 'Reviews: ' + reviews + '\nRating: ' + rating + '\n'
        let object = {fallback: search_data['businesses'][i]['name'], title: search_data['businesses'][i]['name'], title_link: search_data['businesses'][i]['url'], mrkdown_in: ["text"], thumb_url: search_data['businesses'][i]['image_url'], text: final_text}
        attachment_arr.push(object)
      }
      
      // Return response
      const response = {
        response_type: 'in_channel',
        attachments: attachment_arr
      };
      callback(null, response);
    });
  }).on('error', (err) => {
    console.log("Stock Data Request Error", err);
  });
}

function poe(query, league, callback) {
  console.log("poe")
  console.log(query)
  var obj;
  try {
    obj = JSON.parse(fs.readFileSync('formatted_itemdata', 'utf8'));
    console.log(obj[query.toLowerCase()])
    query = obj[query.toLowerCase()];
    query_ = query.replace(/ /g,"_");
  }
  catch (e)
  {
    const response = {
      response_type: 'in_channel',
      text: "Item does not exist or was not found :("
    };
    callback(null, response);
    return;
  }
  request.post(
    'https://www.pathofexile.com/api/trade/search/' + league,
    { json: { query: { status: { option: "online"}, name: query}, sort: { price: "asc"} } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);

            var attachment_arr = [];
            let searchURL = 'https://www.pathofexile.com/api/trade/fetch/' + body.result[0] + ',' + body.result[1] + "?query=" +  body.id;
            console.log(searchURL);
            https.get(searchURL, (res) => {
              console.log('statusCode:', res.statusCode);
              console.log('headers:', res.headers);
          
              // Build data
              var returnData = "";
              res.on('data', (d) => {
                returnData += d;
              });
          
              // Work with data
              res.on('end', function() {
                var data;
                let search_data = JSON.parse(returnData);
                let object = {fallback: query, title: query, title_link: "https://pathofexile.gamepedia.com/" + query_}
                attachment_arr.push(object)

                let stats = "`" + "ilvl " + search_data["result"][0]["item"]["ilvl"] + "`\n";
                try{
                  for(var s in search_data["result"][0]["item"]["implicitMods"])
                  {
                    stats += "`" + search_data["result"][0]["item"]["implicitMods"][s] + "`" + "\n"
                  }
                  stats += "`-------------------------------`"
                  stats += "\n"
                }
                catch(e)
                {
                }
                for(var s in search_data["result"][0]["item"]["explicitMods"])
                {
                  stats += "`" + search_data["result"][0]["item"]["explicitMods"][s] + "`" + "\n"
                }
                console.log(search_data["result"][0])
                console.log(search_data["result"][0]["listing"])
                object = {fallback: search_data["result"][0]["listing"]["price"]["type"] + " " + search_data["result"][0]["listing"]["price"]["amount"] + " " + search_data["result"][0]["listing"]["price"]["currency"], title: search_data["result"][0]["listing"]["price"]["type"] + " " + search_data["result"][0]["listing"]["price"]["amount"] + " " + search_data["result"][0]["listing"]["price"]["currency"], mrkdown_in: ["text"], thumb_url: search_data["result"][0]["item"]["icon"], text: stats + '\n' + search_data["result"][0]["listing"]["whisper"]}
                attachment_arr.push(object)
                // Return response
                const response = {
                  response_type: 'in_channel',
                  attachments: attachment_arr
                };
                callback(null, response);
              });
            }).on('error', (err) => {
              console.log("Stock Data Request Error", err);
            });
        }
        else{
          console.log(error, response.statusCode)
        }
    }
  );
}
