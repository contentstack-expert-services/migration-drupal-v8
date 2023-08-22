/**
 * External module Dependencies.
 */
var mkdirp = require("mkdirp"),
  path = require("path"),
  fs = require("fs"),
  when = require("when"),
  guard = require("when/guard"),
  parallel = require("when/parallel");

/**
* Internal module Dependencies.
*/
var helper = require("../utils/helper");

var authorConfig = config.modules.authors,
  authorsFolderPath = path.resolve(
    config.data,
    config.entryfolder,
    authorConfig.dirName
  ),
  masterFolderPath = path.resolve(config.data, "master", config.entryfolder);
limit = 100;

/**
* Create folders and files
*/
if (!fs.existsSync(authorsFolderPath)) {
  mkdirp.sync(authorsFolderPath);
  helper.writeFile(path.join(authorsFolderPath, authorConfig.fileName));
  mkdirp.sync(masterFolderPath);
  helper.writeFile(
    path.join(masterFolderPath, authorConfig.masterfile),
    '{"en-us":{}}'
  );
}

function ExtractAuthors() {
  this.connection = helper.connect();
}

ExtractAuthors.prototype = {
  putAuthors: function (authordetails) {
    return when.promise(function (resolve, reject) {
      var authordata = helper.readFile(
        path.join(authorsFolderPath, authorConfig.fileName)
      );
      let assetId = helper.readFile(
        path.join(process.cwd(), "drupalMigrationData", "assets", "assets.json")
      );
      var authormaster = helper.readFile(
        path.join(masterFolderPath, authorConfig.masterfile)
      );
      authordetails.map(function (data) {
        var profileimage;
        if (data["name"] !== "") {
          authormaster["en-us"][data["name"]] = "";
          if (
            `assets_${data["picture"]}` in assetId 
            // && dataKey === `${conv_details.field_name}_target_id` &&
            // (conv_details.field_type === "file" ||
            //   conv_details.field_type === "image")
          ) {
            profileimage = assetId[ `assets_${data["picture"]}`]
            // data[dataKey] = assetId[`assets_${value}`];
          }else{
            delete data['picture']
          }
          // var profileimage = data["picture"];
          if (profileimage) {
            authordata[data["name"]] = {
              title: data["name"],
              email: data["mail"],
              picture: profileimage,
              timezone: data["timezone"],
            };
          } else {
            authordata[data["name"]] = {
              title: data["name"],
              email: data["mail"],
              timezone: data["timezone"],
            };
          }
        } else {
          //
        }
        // successLogger("exported author " + "'" + data["name"] + "'");
      });
      helper.writeFile(
        path.join(authorsFolderPath, authorConfig.fileName),
        JSON.stringify(authordata, null, 4)
      );
      helper.writeFile(
        path.join(masterFolderPath, authorConfig.masterfile),
        JSON.stringify(authormaster, null, 4)
      );
      resolve();
    });
  },
  getAuthors: function (skip) {
    var self = this;
    return when.promise(function (resolve, reject) {
      // self.connection.connect()
      var query = config["mysql-query"]["authors"];
      query = query + " limit " + skip + ", " + limit;
      self.connection.query(query, function (error, rows, fields) {
        if (!error) {
          if (rows.length > 0) {
            self.putAuthors(rows);
            resolve();
          }
        } else {
          errorLogger("no authors found");
          resolve(error);
        }
      });
    });
  },
  getAllAuthors: function (usercount) {
    var self = this;
    return when.promise(function (resolve, reject) {
      var _getAuthors = [];
      for (var i = 0, total = usercount; i < total; i += limit) {
        _getAuthors.push(
          (function (data) {
            return function () {
              return self.getAuthors(data);
            };
          })(i)
        );
      }
      var guardTask = guard.bind(null, guard.n(1));
      _getAuthors = _getAuthors.map(guardTask);
      var taskResults = parallel(_getAuthors);
      taskResults
        .then(function (results) {
          self.connection.end();
          resolve();
        })
        .catch(function (e) {
          errorLogger("something wrong while exporting authors:", e);
          reject(e);
        });
    });
  },
  start: function () {
    // successLogger("exporting authors...");
    var self = this;
    return when.promise(function (resolve, reject) {
      self.connection.connect();
      var query = config["mysql-query"]["authorCount"];
      self.connection.query(query, function (error, rows, fields) {
        if (!error) {
          var usercount = rows[0]["usercount"];
          if (usercount > 0) {
            self
              .getAllAuthors(usercount)
              .then(function () {
                resolve();
              })
              .catch(function () {
                reject();
              });
          } else {
            errorLogger("no authors found");
            self.connection.end();
            resolve();
          }
        } else {
          errorLogger("failed to get authors count: ", error);
          self.connection.end();
          reject(error);
        }
      });
    });
  },
};

module.exports = ExtractAuthors;
