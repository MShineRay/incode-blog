const mysql = require ('mysql')

const config = require('../../../config')('local')

const crypto = require('crypto');

console.log('config', config)

var con = mysql.createConnection(config.database)

function testConnection() {
  console.log("testing connection");
  con.query("SELECT * FROM user where facebook_id = '22'", function(err, rows) {
    console.log("back from query, err is :", err)
    if(err) throw err;
    
    console.log('Data rows received from Db:', rows.length);
    console.log(rows);
  });
}


testConnection();


const createFBSQL = "insert into user(user_uuid, facebook_id, display_name, updated_at) values (uuid_short() % 10000000000, ?, ?, now())";

const findFBSQL = "SELECT * FROM user where facebook_id = ?";
const findUserSQL = "SELECT * FROM user where user_uuid = ?";
const deleteUserSQL = "DELETE FROM user where user_uuid = ?";

const updateFBUserSQL = "UPDATE user set username = ?, email = ?, icloud_credential = ?, display_name = ?, wants_status_email = ? where facebook_id = ?"


function fetchUserRow(userID, cb) {

  var query = con.query(findUserSQL, userID , function(err, results) {
    if (err) {
      console.log(err);
      cb(err, null);
      return;
    } else {
      if (results.length == 0) {
	console.log("no rows for userID: ", userID)
	cb(null, null);
      } else {
	cb(null, injectAuthToken(results[0]));
      }
    }
  });
}

function deleteUserRow(userID, cb) {

  var query = con.query(deleteUserSQL, userID , function(err, results) {
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

function fetchFBUserRow(FBUserID, cb) {

  var query = con.query(findFBSQL, FBUserID , function(err, results) {
    if (err) {
      console.log(err);
      cb(err, null);
      return;
    } else {
      if (results.length == 0) {
	console.log("no rows for FBUserID: ", FBUserID)
	cb(null, null);
      } else {
	cb(null, injectAuthToken(results[0]));
      }
    }
  });
}

function findOrMakeFBUserRow(FBUserID, FBDisplayName, cb) {

  fetchFBUserRow(FBUserID, function(err, result) {
    if (err) {
      console.log(err);
      cb(err, null);
    } else {
      if (result) {
	cb(null, result);
      } else {
	con.query(createFBSQL, [FBUserID, FBDisplayName], function(err, result) { 
	  if (err) {
	    console.log(err);
	    cb(err, null)
	  } else {
	    console.log("We appear to have created a new user for FBUserID: " , FBUserID);
	    fetchFBUserRow(FBUserID, cb);
	  }			
	});
      }
    }
  });
}

function updateFBUserRow(userObj, cb) {
  con.query(updateFBUserSQL, [userObj.username, userObj.email, userObj.icloudCredentials, userObj.display_name, userObj.wants_status_email, userObj.facebook_id], function(err, result) { 
    if (err) {
      console.log(err);
      cb(err, null)
    } else {
      console.log("We appear to have updated FBUserID: " , userObj.facebook_id);
      fetchFBUserRow(userObj.facebook_id, cb);
    }			
  });

}

function injectAuthToken(userObj) {
  return Object.assign({}, userObj, { auth_token: authTokenFromUserID(userObj['user_uuid']) });
}

function userIDFromAuthToken(token) {
  const decipher = crypto.createDecipher('aes192', config.userkey);
  var decrypted = '';
  decipher.on('readable', () => {
    var data = decipher.read();
    if (data)
      decrypted += data.toString('utf8');
  });
  decipher.on('end', () => {
    console.log(decrypted);
    // Prints: some clear text data
  });
  
  decipher.write(token, 'hex');
  decipher.end();
  
  console.log('decrypted', decrypted)
  return parseInt(decrypted, 10)

}

function authTokenFromUserID(userID) {
  const idstr = userID.toString()
  const cipher = crypto.createCipher('aes192', config.userkey);

  var encrypted = cipher.update(idstr, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  console.log('encrypted', encrypted)
  return encrypted;
  
}

fbTokens = {}

var User = {

  
  getOrCreateFBUser:  function(FBUserID, FBDisplayName, cb) {
    console.log("gonna getOrCreate: ", FBDisplayName);
    findOrMakeFBUserRow(FBUserID, FBDisplayName, function(err, data){
      if (err) {
	cb(err)
	return;
      }

      cb(null,data);
    });


  },
  
  findByID: function(userID, cb) {
    return fetchUserRow(userID, cb)
  },

  findByAuthToken: function(authToken, cb) {
    const userID = userIDFromAuthToken(authToken);
    return fetchUserRow(userID, cb);
  },
  
  updateFBUser: function(userObj, cb) {
    console.log("gonna update : ", userObj);
    return updateFBUserRow(userObj, cb);
  },

  deleteUser: function(userObj, cb) {
    return deleteUserRow(userObj['user_uuid'], cb);
  },
  
  userFBAccessToken: function(userObj) {
    return fbTokens[userObj['user_uuid']];
  },
  
  setUserFBAccessToken: function(userObj, accessToken) {
    fbTokens[userObj['user_uuid']] = accessToken;
    console.log(" set access token: ", userObj['user_uuid'], " : ", fbTokens[userObj['user_uuid']] );
  }
}
module.exports.User = User

