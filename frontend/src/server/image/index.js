var mysql = require ('mysql')

var config = require('../../../config')('local')

console.log('config', config)

var con = mysql.createConnection(config.database)

function testConnection() {
  console.log("testing connection");
  con.query("SELECT * FROM user where facebook_id = '22'", function(err, rows) {
    console.log("back from query, err is :", err);
    if(err) throw err;
    
    console.log('Data rows received from Db:', rows.length);
    console.log(rows);
  });
}


testConnection();


var findImageSQL = "SELECT * FROM image where image_uuid = ?";
var deleteOwnerImagesSQL = "DELETE FROM image where owner_uuid = ?";


function fetchImageRow(imageID, cb) {

  var query = con.query(findImageSQL, imageID , function(err, results) {
    if (err) {
      console.log(err);
      cb(err, null);
      return;
    } else {
      if (results.length == 0) {
	console.log("no rows for imageID: ", imageID);
	cb("no rows for imageID: " + imageID, null);
      } else {
	var row = results[0];
	var metaStr = row['metadata'];
	row['metadata'] = JSON.parse(row['metadata']);
	cb(null, row);
      }
    }
  });
}

function deleteOwnerImageRows(ownerID, cb) {

  var query = con.query(deleteOwnerImagesSQL, ownerID , function(err, results) {
    if (err) {
      console.log(err);
      cb(err, null);
      return;
    } else {
      if (results.length == 0) {
	cb(null, null);
      } else {
	cb(null, "deleted");
      }
    }
  });
}


var Image = {
  
  findByID: function(imageID, callback) {
    fetchImageRow(imageID, callback);
  },

  deleteOwnerImages: function(ownerID, callback) {
    deleteOwnerImageRows(ownerID, callback);
  }

}
module.exports.Image = Image;

