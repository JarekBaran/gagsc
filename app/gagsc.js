var input = document.getElementById('input');
var output = document.getElementById('output');
var updated = document.getElementById('updated');
var rows = [];

updated.innerHTML = logMsg;

function ajax(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

ajax('./data/data.json', function(data) {
  for (var key in data) {
    if (typeof data[key].ua != 'undefined'){
      rows.push({
        values: [data[key].domain, data[key].ua, data[key].account],
        markup: '<tr>' +
                  '<td>' + data[key].domain + '</td>' +
                  '<td>' + data[key].ua + '</td>' +
                  '<td>' + data[key].account + '</td>' +
                '</tr>',
        active: true
      });
    } else {
      rows.push({
        values: [data[key].domain, data[key].account],
        markup: '<tr>' +
                  '<td>' + data[key].domain + '</td>' +
                  '<td> GSC </td>' +
                  '<td>' + data[key].account + '</td>' +
                '</tr>',
        active: true
      });
    }
  }
})

var filterRows = function(rows) {
  var results = [];
  for(var i = 0, ii = rows.length; i < ii; i++) {
    if(rows[i].active) results.push(rows[i].markup)
  }
  return results;
}

var clusterize = new Clusterize({
  rows: filterRows(rows),
  scrollId: 'gagsc',
  contentId: 'output',
  no_data_text: 'No matches, give a minimum of 3 characters...'
});

var search = function() {
  if(input.value.length > 2){
    for(var i = 0, ii = rows.length; i < ii; i++) {
      var suitable = false;
      for(var j = 0, jj = rows[i].values.length; j < jj; j++) {
        if(rows[i].values[j].toString().indexOf(input.value) + 1)
          suitable = true;
      }
      rows[i].active = suitable;
    }
    clusterize.update(filterRows(rows));
  } else {
    clusterize.clear();
  }
}

input.oninput = search;
