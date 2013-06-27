var _ = require('utils');

var setForm = function(extension) {
  switch (extension) {
    case 'jpg': return SaveDocumentType.JPEG; break;
    case 'gif': return SaveDocumentType.COMPUSERVEGIF; break;
    default: return SaveDocumentType.PNG;
  }
}

var getExportOptions = function(layerName) {
  var options = new ExportOptionsSaveForWeb();
  options.format = SaveDocumentType.PNG
  if (options.format === SaveDocumentType.PNG) options.PNG8 = false; 
  if (options.format !== SaveDocumentType.JPEG) options.transparency = true; 
  options.interlaced = false; 
  var quality = layerName.split('quality=')[1];
  options.quality = quality || 80;
  return options;
};

var setVisibility = function(layers, visibility) {
  _.forEach(layers, function(l) { l.visible = visibility; });
};

var mergeLayerSets = function(layerSets) {
  _.forEach(layerSets, function(layerSet, index, array) {
    var artLayer = layerSet.merge();
    artLayer.copy(true); // `true` includes all visible layers inside group
  });
}

var findVisibleLayers = function(layers) {
  var visibleLayers = [];
  _.forEach(layers, function(layer, i, array) {
    if (layer.visible)
      visibleLayers.push(layer);
  });
  return visibleLayers;
};

var getLayerWidth = function(bounds) {
  return Math.abs(bounds[0]) + Math.abs(bounds[2]);
}

var getLayerHeight = function(bounds) {
  return Math.abs(bounds[1]) + Math.abs(bounds[3]);
}

var getSelectRectangle = function(bounds) {
  return [
            [bounds[0], bounds[1]]
          , [bounds[2], bounds[1]]
          , [bounds[2], bounds[3]]
          , [bounds[0], bounds[3]]
        ]
}

var exportLayers = function(layers, document) {
  _.forEach(layers, function(layer, i, array) {
    var file = new File(document.path + '/' + layer.name)
      , exportOptions = getExportOptions(layer.name);

    layer.visible = true;
    document.activeLayer = layer;
    document.selection.select(getSelectRectangle(layer.bounds));
    document.selection.copy();
    var tempWidth = getLayerWidth(layer.bounds);
    var tempHeight = getLayerHeight(layer.bounds);
    console.log('layer.name: ' + layer.name);
    console.log('layer.width: ' + tempWidth);
    console.log('layer.height: ' + tempHeight);
    var temp = app.documents.add(tempWidth, tempHeight, null, null, null, DocumentFill.TRANSPARENT);
    temp.paste();
    temp.exportDocument(file, ExportType.SAVEFORWEB, exportOptions); 
    temp.close(SaveOptions.DONOTSAVECHANGES);
    document.selection.deselect();
    layer.visible = false;
  });
};

var layerSlice = function(callback) {
  var document = app.activeDocument
    , originalDocumentFilePath = document.fullName
    , visibleLayers;

  document.rasterizeAllLayers();

  mergeLayerSets(document.layerSets);

  visibleLayers = findVisibleLayers(document.layers);
  setVisibility(visibleLayers, false);
  exportLayers(visibleLayers, document);
  setVisibility(visibleLayers, true);

  document.close(SaveOptions.DONOTSAVECHANGES);
  app.open(new File(originalDocumentFilePath));
 
  callback();
};

exports = layerSlice;