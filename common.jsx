;(function(global) {

  // JSON support
  $.evalFile('~/Documents/Hacker-School/layer-slice/stdlib/json2.js');

  var LOCAL_PATHS = ['node_modules']
    , FILE_TYPES = [ '.jsx', '.js', '.json' ]
    , dependencies = {};

  var findModule = function(moduleName) { 
    return (dependencies[moduleName]) ? findModuleInPath(dependencies[moduleName]) : null;
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

  var pkgFile = new File('~/Documents/Hacker-School/layer-slice/package.json');
  pkgFile.open('r');
  var pkg = JSON.parse(pkgFile.read());
  var pkgDependencies = pkg.dependencies;
  for (var i in pkgDependencies) {
    // Look into this directory and grab main.js -- add to map
    // Look into the new dependencies and add those dependencies too!
    dependencies[i] = '~/Documents/Hacker-School/layer-slice/node_modules/' + i + '/' + i;
  }

  // Export #require
  global.require = require; 

  // Export "stdlib" functions:
  global.console = require('./stdlib/console');

}(this));