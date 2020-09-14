const client = require('../database');

exports.getAdminById = (req,res,next,id) =>{
    client.query(`SELECT * FROM trafficoffices WHERE gid=${id}`, (err, result)=>{
        if (err){
            return res.status(400).json({
                error: "Admin not found"
            })
        }
        req.profile = result.rows[0];
        client.query(`SELECT ST_AsGeoJSON(geom) FROM trafficoffices WHERE gid=${id}`, (err,results) =>{
            if(err){
                return res.status(400).json({
                    error: "Error in converting geometry to geojson"
                })
            }
            req.profile.geom = results.rows[0].st_asgeojson;
            next();
        });    

        })
}  

exports.getAdmin = (req,res) =>{
    return res.json({
     "type": "Feature",
     "properties": { "name": req.profile.name, "region": req.profile.region, "division": req.profile.division, "city": req.profile.city, "type": req.profile.type }, 
     "geometry": JSON.parse(req.profile.geom)
    })
}
