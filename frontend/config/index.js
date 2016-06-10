//

const localdb = {
  host     : 'ic-dev-cluster.cluster-c5nkdi9sl4i0.us-west-2.rds.amazonaws.com',
  user     : 'imgcat',
  password : 'img302cat',
  database : 'imgcat'
}

// FIXME: encrypt these
const facebook_credentials = {
  clientID: "588463747978133",
  clientSecret: "bba4af637bcee7e8f0c2071ae019765f",
}

const aws_credentials = {
  access_keyID: 'AKIAJAE46TULNP2TCZWQ',
  secret_access_key: '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' 
}

// configuration data for all modes
var config = {
  local: {
    mode: 'local',
    facebook_credentials: facebook_credentials,
    server_host: "localhost.blnz.com:3000",
    database: localdb,
    userkey: 'lean56doctor',
    aws_credentials: aws_credentials,
    port: 3000
  },
  staging: {
    mode: 'staging',
    facebook_credentials: facebook_credentials,
    server_host: "localhost.blnz.com:3000",
    database: localdb,       
    userkey: 'lean56doctor',
    aws_credentials: aws_credentials,
    port: 3000
  },
  production: {
    mode: 'production',
    facebook_credentials: facebook_credentials,
    server_host: "imgcat.blnz.com",
    database: localdb,
    userkey: 'lean56doctor',
    aws_credentials: aws_credentials,
    port: 8000
  }
}

// retruns configuration for the named mode. if none provided tries the command argument

module.exports = function(mode) {
  // return the congiguration as requested by "mode" argument, or
  // failing that, on the command line, or
  // fall back to local
  return config[mode || process.argv[2] || 'local'] || config.local;
}
