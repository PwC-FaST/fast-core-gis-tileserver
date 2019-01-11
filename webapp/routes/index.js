var express = require('express');
var router = express.Router();
var VTGenerator = require('../local_modules/vector-tile-generator');

host = process.env.MONGODB_HOST || 'localhost'
port = process.env.MONGODB_PORT || 27017
db = process.env.TARGET_DB || 'fast'

lpisCollection = process.env.LPIS_COLLECTION || 'lpis'
socCollection = process.env.SOC_COLLECTION || 'soc'
hydroCollection = process.env.HYDRO_COLLECTION || 'hydro'
natura2000Collection = process.env.NATURA2000_COLLECTION || 'natura2000'
topsoilCollection = process.env.TOPSOIL_COLLECTION || 'topsoil'

urlPrefix = process.env.FRONTEND_URL_PREFIX || '/'

if (urlPrefix.slice(-1) != '/') {
    urlPrefix += '/'
}

// Mongoose import
var mongoose = require('mongoose');

// Mongoose connection to MongoDB
mongoose.connect('mongodb://' + host + ':' + port + '/' + db, { useNewUrlParser: true }, function (error) {
    if (error) {
        console.log(error);
    }
});

// Mongoose Schema definition
var Schema = mongoose.Schema;
var GeoJSONSchema = new Schema({
    _id: Schema.Types.String,
    geometry: {
      coordinates: []
    }
})

// Mongoose Model definition
var Parcel = mongoose.model('JString', GeoJSONSchema, lpisCollection);
var Soc = mongoose.model('JString', GeoJSONSchema, socCollection);
var Hydro = mongoose.model('JString', GeoJSONSchema, hydroCollection);
var Natura = mongoose.model('JString', GeoJSONSchema, natura2000Collection);
var Topsoil = mongoose.model('JString', GeoJSONSchema, topsoilCollection);

// VTGenerator initialisation
var vtgen = new VTGenerator({})


router.get('/', function (req, res) {
    res.render('map');
});

router.get('/layer/lpis/:z/:x/:y.pbf', function (req, res) {

    var tile = {
        x: parseInt(req.params.x),
        y: parseInt(req.params.y),
        z: parseInt(req.params.z)
    }

    minZoom = 15
    if (req.query.minZoom && req.query.minZoom > 10) {
        minZoom = req.query.minZoom
    }
    if (tile.z < minZoom) {
        return res.status(204).send()
    }

    var g = vtgen.getGeoJSONEnvelope(tile);

    Parcel.find(
        { geometry: { $geoIntersects: { $geometry: g } } },
        {},
        function(err, parcels) {
            if (err) {
                res.status(500).send({ "error": err })
            }else {
                if (parcels.length) {
                    pbf = vtgen.fromGeoJSON(
                        tile,
                        {
                            "type": "FeatureCollection",
                            "features": parcels.map(function (p) {
                                doc = p.toJSON();
                                doc.properties.id = doc._id;
                                delete doc._id;
                                delete doc.properties.crs;
                                delete doc.properties.legal_crs;
                                return doc
                            })
                        },
                        'lpis')
                    res.send(pbf)
                }
                else {
                    res.status(204).send()
                }
        }
    });
});

router.get('/layer/esdac/soc/:z/:x/:y.pbf', function (req, res) {

    var tile = {
        x: parseInt(req.params.x),
        y: parseInt(req.params.y),
        z: parseInt(req.params.z)
    }

    if (tile.z < 13) {
        return res.status(204).send()
    }

    var g = vtgen.getGeoJSONEnvelope(tile);

    Soc.find(
        { geometry: { $geoIntersects: { $geometry: g } } },
        {},
        function(err, socs) {
            if (err) {
                res.status(500).send({ "error": err })
            }else {
                if (socs.length) {
                    pbf = vtgen.fromGeoJSON(
                        tile,
                        {
                            "type": "FeatureCollection",
                            "features": socs.map(function (s) {
                                doc = s.toJSON();
                                doc.properties.id = doc._id;
                                delete doc._id;
                                delete doc.properties.crs;
                                delete doc.properties.legal_crs;
                                return doc
                            })
                        },
                        'soc')
                    res.send(pbf)
                }
                else {
                    res.status(204).send()
                }
            }
        });
});

router.get('/layer/hydro/:z/:x/:y.pbf', function (req, res) {

    var tile = {
        x: parseInt(req.params.x),
        y: parseInt(req.params.y),
        z: parseInt(req.params.z)
    }

    if (tile.z < 13) {
        return res.status(204).send()
    }

    var g = vtgen.getGeoJSONEnvelope(tile);

    Hydro.find(
        { geometry: { $geoIntersects: { $geometry: g } } },
        {},
        function(err, hydros) {
            if (err) {
                res.status(500).send({ "error": err })
            }else {
                if (hydros.length) {
                    pbf = vtgen.fromGeoJSON(
                        tile,
                        {
                            "type": "FeatureCollection",
                            "features": hydros.map(function (h) {
                                doc = h.toJSON();
                                doc.properties.id = doc._id;
                                delete doc._id;
                                delete doc.properties.crs;
                                delete doc.properties.legal_crs;
                                return doc
                            })
                        },
                        'hydro')
                    res.send(pbf)
                }
                else {
                    res.status(204).send()
                }
            }
        });
});

router.get('/layer/natura2000/:z/:x/:y.pbf', function (req, res) {

    var tile = {
        x: parseInt(req.params.x),
        y: parseInt(req.params.y),
        z: parseInt(req.params.z)
    }

    if (tile.z < 13) {
        return res.status(204).send()
    }

    var g = vtgen.getGeoJSONEnvelope(tile);

    Natura.find(
        { geometry: { $geoIntersects: { $geometry: g } } },
        {},
        function(err, naturas) {
            if (err) {
                res.status(500).send({ "error": err })
            }else {
                if (naturas.length) {
                    pbf = vtgen.fromGeoJSON(
                        tile,
                        {
                            "type": "FeatureCollection",
                            "features": naturas.map(function (n) {
                                doc = n.toJSON();
                                doc.properties.id = doc._id;
                                delete doc._id;
                                delete doc.properties.crs;
                                delete doc.properties.legal_crs;
                                return doc
                            })
                        },
                        'natura2000')
                    res.send(pbf)
                }
                else {
                    res.status(204).send()
                }
            }
        });
});

router.get('/layer/topsoil/:z/:x/:y.pbf', function (req, res) {

    var tile = {
        x: parseInt(req.params.x),
        y: parseInt(req.params.y),
        z: parseInt(req.params.z)
    }

    if (tile.z < 8) {
        return res.status(204).send()
    }

    var g = vtgen.getGeoJSONEnvelope(tile);

    Topsoil.find(
        { geometry: { $geoIntersects: { $geometry: g } } },
        {},
        function(err, tps) {
            if (err) {
                res.status(500).send({ "error": err })
            }else {
                if (tps.length) {
                    pbf = vtgen.fromGeoJSON(
                        tile,
                        {
                            "type": "FeatureCollection",
                            "features": tps.map(function (t) {
                                doc = t.toJSON();
                                doc.properties.id = doc._id;
                                delete doc._id;
                                delete doc.properties.crs;
                                delete doc.properties.legal_crs;
                                return doc
                            })
                        },
                        'topsoil')
                    res.send(pbf)
                }
                else {
                    res.status(204).send()
                }
            }
        });
});

router.get('/healthz', function(req,res) {
    status = 200
    if (mongoose.connection.readyState != 1) {
        status = 500
    }else {
        Parcel.findOne(function(err, doc) {
            if (err) {
                status = 500
            }
        })

    }
    res.status(status).send();
});

module.exports = router;
