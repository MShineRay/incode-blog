var mysql = require ('mysql')

var config = require('../../../config')()

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
var deleteOwnerFingerprintsSQL = "DELETE FROM fingerprint_word where owner_uuid = ?";
var findSimilarSQL = "select image_uuid, count(*) as count from fingerprint_word where owner_uuid = ? and fp_word in ( select fp_word from fingerprint_word where image_uuid = ? ) GROUP BY image_uuid order by count desc limit 5";

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

function fetchSimilarImageRows(imageID, cb) {

  console.log("fetchSimilarImageRows for:", imageID);
  fetchImageRow(imageID, function(err, data) {
    if (err) {
      cb(err);
      return;
    }
    console.log("got my row");
			     
    var ownerID = data.owner_uuid;
    var query = con.query(findSimilarSQL, [ ownerID, imageID ] , function(err, results) {
      if (err) {
	console.log(err);
	cb(err, null);
	return;
      } else {
	var similar = [];
	if (results.length == 0) {
	  cb(null, similar);
	} else {
	  console.log("fetchSimilarImageRows: looking at ", results.length, "similar images");
	  
	  // recursive calls till we've gathered details for all the results
	  // FIXME: can make more performant by running as a SQL single query

	  (function next(index) {
	    if (index === results.length) { // No items left, so bail out
	      cb(null, similar)
              return;
	    }
	    var nextID = results[index]['image_uuid'];
	    var count = results[index]['count'];
	    console.log("fetchSimilarImageRows: image ", nextID , " has score of ", count);
	    fetchImageRow(nextID, function(err, imageRow) {
	      if (err) {
		cb(err);
		return;
	      }
              similar.push({ image_uuid: nextID, score: count, details: imageRow } );
              next(index + 1);
	    });
	  })(0);
	}
      }
    });
  });
}

function deleteOwnerImageRows(ownerID, cb) {

  var q1 = con.query(deleteOwnerFingerprintsSQL, ownerID , function(err, results) {
    if (err) {
      console.log(err);
    }
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
    })
  });
}


var Image = {
  
  findByID: function(imageID, callback) {
    fetchImageRow(imageID, callback);
  },
  
  findSimilar: function(imageID, callback) {
    fetchSimilarImageRows(imageID, callback);
  },

  deleteOwnerImages: function(ownerID, callback) {
    deleteOwnerImageRows(ownerID, callback);
  }

}
module.exports.Image = Image;

