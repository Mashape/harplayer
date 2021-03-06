var request = require('request')

function replay(harr, callback) {
  var options = {
    method: harr.method,
    uri: harr.url,
    har:  harr
  }

  request(options, function(err, res, body) {
    callback(err, res, body)
  })
}

function oneByOne(arr, fun, callback) {
  var entries = arr.map(function(item){return item})
  fun(entries[0].request, callback)
  entries.shift()
  if (entries.length === 0) {
    return
  }
  oneByOne(entries, fun, callback)  
}

function allAtOnce(arr, fun, callback) {
  arr.map(function(item) { 
    replay(item.request, callback)
  })
}

module.exports = {
  replayOne: function(har, index, callback) {
    replay(har.log.entries[index].request, callback)
  }, 
  replayAll: function(har, callback) {
    oneByOne(har.log.entries, replay, callback)
  }, 
  replayAllInParallel: function(har, callback) {
    allAtOnce(har.log.entries, replay, callback)
  }
}
