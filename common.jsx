;(function(global) {

  // JSON support
  $.evalFile('~/Documents/Hacker-School/layer-slice/stdlib/json2.js');

  var LOCAL_PATHS = ['node_modules']
    , FILE_TYPES = [ '.jsx', '.js', '.json' ]
    , path = '~/Documents/Hacker-School/layer-slice/'
    , pathStack = [];

  var findModule = function(moduleName) { 
    var dir = path + 'node_modules/' + pathStack.join('/node_modules/');
    var pkgFile = new File(dir + '/package.json');
    pkgFile.open('r');
    var pkg = JSON.parse(pkgFile.read());
    var mainFile = dir + '/' + pkg.main;
    var result = findModuleInPath(mainFile); 
    return result;
  }

  var findModuleInPath = function(pathAndModuleName) {
    var file;
    // See if the file was referenced with an extension in `require`:
    file = new File(pathAndModuleName);
    if (file.exists) { return file; };

    // Try for designated file types if not appended with an extension:
    for (var i = 0; i < FILE_TYPES.length; i++) {
      file = new File(pathAndModuleName + FILE_TYPES[i]);
      if (file.exists) { break; };
    }

    return (file.exists) ? file : null;
  }

  var require = function(moduleName) {

    // TODO: check if the module is already loaded!!

    var module = { exports : {} }
      , exports = module.exports
      , pkg = false
      , file;

    if (/^\./.test(moduleName)) {
      file = findModuleInPath(path + moduleName);
    } else {
      pathStack.push(moduleName);
      pkg = true;
      file = findModule(moduleName);
    }
    
    if (!file) { throw new Error('Cannot find ' + moduleName); };

    $.evalFile(file);
    
    if (pkg) { pathStack.pop(); }

    return exports;
  };

  global.require = require; 
  global.console = require('./stdlib/console');

}(this));