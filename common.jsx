;(function(global) {

  var LOCAL_PATHS = ['node_modules']
    , FILE_TYPES = [ '.jsx', '.js', '.json' ];

  var findModule = function(moduleName) {
    var PATHS = ['~/Documents/Hacker-School/layer-slice/node_modules/'];
    var file;
    for (var i = 0; i < PATHS.length; i++) {
      file = findModuleInPath(PATHS[i] + moduleName); 
      if (file.exists) break;
    }
    return file;
  }

  var findModuleInPath = function(pathAndModuleName) {
    var file;
    for (var i = 0; i < FILE_TYPES.length; i++) {
      file = new File(pathAndModuleName + FILE_TYPES[i]);
      if (file.exists) break;
    }
    return (file.exists) ? file : null;
  }

  var require = function(moduleName) {
    var module = { exports : {} }
      , exports = module.exports
      , path = '~/Documents/Hacker-School/layer-slice/'
      , file;

    if (/^\./.test(moduleName)) {
      file = findModuleInPath(path + moduleName);
    } else {
      file = findModule(moduleName);
    }
    
    if (!file) { throw new Error('Cannot find ' + moduleName); };
    
    $.evalFile(file);
    return exports;
  };

  // JSON support
  $.evalFile('~/Documents/Hacker-School/layer-slice/stdlib/json2.js');

  // Export #require
  global.require = require; 

  // Export "stdlib" functions:
  global.console = require('./stdlib/console');

}(this));