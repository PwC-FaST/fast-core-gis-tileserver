var geojsonvt = require('geojson-vt');
var vtpbf = require('vt-pbf');
var GeoJSONWrapper = vtpbf.GeoJSONWrapper;
var SphericalMercator = require('@mapbox/sphericalmercator');

let defaultTileSize = 256


var VTGenerator = function (options) {

    this.projection = new SphericalMercator({
        size: options.tileSize || defaultTileSize
    });
}

VTGenerator.prototype.getGeoJSONEnvelope = function(tile,srs = 'WGS84') {

    bounds = this.projection.bbox(tile.x,tile.y,tile.z,false,srs);

    var g = {
        "type": "Polygon",
        "coordinates": [
            [
                [bounds[0], bounds[1]],
                [bounds[2], bounds[1]],
                [bounds[2], bounds[3]],
                [bounds[0], bounds[3]],
                [bounds[0], bounds[1]]
            ]
        ]
    };

    return g
}

VTGenerator.prototype.fromGeoJSON = function (tile, featureCollection, layerName = 'geojsonLayer') {

    index = geojsonvt(featureCollection, {
        maxZoom: tile.z+1,
        indexMaxZoom: tile.z-1
    });

    layers = {};
    layers[layerName] = index.getTile(tile.z,tile.x,tile.y);

    buf = vtpbf.fromGeojsonVt(layers);

    return new Buffer(buf);
}

module.exports = VTGenerator;
