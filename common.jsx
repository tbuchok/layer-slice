var require = function(moduleName) {
  var module = { exports : {} }
    , exports = module.exports
    , path = '~/Documents/Hacker-School/layer-slice/lib/'
    , fileTypes = [ '.jsx', '.js', '.json' ]
    , i = 0;
  
  for (; i < fileTypes.length; i++) {
    var m = new File(path + moduleName + fileTypes[i]);
    if (m.exists) break;
  }
  
  if (i === fileTypes.length - 1) 
    throw new Error('Cannot find module ' + moduleName + ' in /lib.');
  
  $.evalFile(new File(path + moduleName + fileTypes[i]));
  return exports;
};

var console = require('console');