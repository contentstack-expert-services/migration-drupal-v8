var mkdirp = require("mkdirp"),
  path = require("path"),
  _ = require("lodash"),
  fs = require("fs"),
  when = require("when"),
  guard = require('when/guard'),
  parallel = require('when/parallel'),
  sequence = require('when/sequence');
phpUnserialize = require("phpunserialize");

/**
 * Internal module Dependencies.
 */
var helper = require("../utils/helper");

var referencesConfig = config.modules.references,
  referencesFolderPath = path.resolve(
    config.data,
    referencesConfig.dirName
  ),

validKeys = referencesConfig.validKeys;
/**
 * Create folders and files
 */
mkdirp.sync(referencesFolderPath);
if (!fs.existsSync(referencesFolderPath)) {
  mkdirp.sync(referencesFolderPath);
  helper.writeFile(
    path.join(referencesFolderPath, referencesConfig.fileName)
  );
  helper.writeFile(
    path.join(referencesFolderPath, referencesConfig.fileName)
  )
} else {
  helper.writeFile(
    path.join(referencesFolderPath, referencesConfig.fileName)
  )
}

function ExtractReferences() {
  this.connection = helper.connect();
}

ExtractReferences.prototype = {
  start: function () {
    var self = this;

    return when.promise(function (resolve, reject) {
      self
        .getReferences()
        .then(function () {
          resolve()
        })
        .catch(function () {
          reject()
        })
    });
  },
  getReferences: function () {
    var self = this;
    return when.promise(function (resolve, reject) {
      var queryPageConfig = helper.readFile(
        path.join(process.cwd(), "/drupalMigrationData/query/index.json")
      );
      var pagequery = queryPageConfig.page;
      var _getPage = [];

      for (var key in pagequery) {
        _getPage.push(function (key) {
          return function () {
            return self.getPageCountQuery(key, queryPageConfig)
          }
        }(key));
      }
      var taskResults = sequence(_getPage);

      taskResults
        .then(function (results) {
          self.connection.end();
          resolve();
        })
        .catch(function (e) {
          errorLogger("something wrong while exporting entries " + key + ": ", e);
          reject(e);
        })
    })
  },
  getPageCountQuery: function (pagename, queryPageConfig) {
    var self = this;

    return when.promise(function (resolve, reject) {
      var query = queryPageConfig["count"]["" + pagename + "Count"];
      self.connection.query(query, function (error, rows, fields) {

        if (!error) {
          var countentry = rows[0]["countentry"];

          if (countentry > 0) {
            self.getPageCount(pagename, countentry, queryPageConfig)
              .then(function () {
                resolve()
              })
              .catch(function () {
                reject()
              })
          } else {
            resolve();
          }
        } else {
          reject(error)
        }
      })
    })
  }
  ,
  putPosts: function (postsdetails, key) {
    return when.promise(function (resolve, reject) {
      var referenceData = helper.readFile(
        path.join(process.cwd(), "/drupalMigrationData/references/references.json")
      );

      postsdetails.map((data) => {
        referenceData[`content_type_entries_title_${data.nid}`] = {
          uid: `content_type_entries_title_${data.nid}`,
          _content_type_uid: key,
        }
        helper.writeFile(
          path.join(process.cwd(), "/drupalMigrationData/references/references.json"),
          JSON.stringify(referenceData, null, 4)
        );
      })
      resolve();
    })
  },
  getQuery: function (pagename, skip, queryPageConfig) {
    var self = this;
    return when.promise(function (resolve, reject) {
      var query = queryPageConfig["page"]["" + pagename + ""];
      query = query + " limit " + skip + ", " + limit;
      self.connection.query(query, function (error, rows, fields) {
        if (!error) {
          if (rows.length > 0) {

            resolve();
            self.putPosts(rows, pagename)
              .then(function (results) {
                resolve(results);
              })
              .catch(function () {
                reject()
              })
          }
          else {
            resolve();
          }
        } else {
          reject(error);
        }
      })
    })
  },
  getPageCount: function (pagename, countentry, queryPageConfig) {
    var self = this;
    return when.promise(function (resolve, reject) {
      var _getPage = [];

      for (var i = 0, total = countentry; i < total; i += limit) {
        _getPage.push(function (data) {
          return function () {
            return self.getQuery(pagename, data, queryPageConfig);
          }
        }(i));
      }
      var guardTask = guard.bind(null, guard.n(1));
      _getPage = _getPage.map(guardTask);
      var taskResults = parallel(_getPage);
      taskResults
        .then(function (results) {
          resolve();
        })
        .catch(function (e) {
          errorLogger("something wrong while exporting entries" + pagename + ":", e);
          reject(e);
        })
    })
  },
  putReferences: function (contentdetails) {
    var self = this;
    return when.promise(function (resolve, reject) {
      var queryPageConfig = helper.readFile(
        path.join(process.cwd(), "/drupalMigrationData/query/index.json")
      );
      var pagequery = queryPageConfig.page;
      var _getPage = [];
      for (var key in pagequery) {
        _getPage.push(function (key) {
          return function () {
            return self.getPageCountQuery(key, queryPageConfig)
          }
        }(key));
      }

      var taskResults = sequence(_getPage);
      taskResults
        .then(function (results) {
          self.connection.end();
          resolve();
        })
        .catch(function (e) {
          errorLogger("something wrong while exporting entries " + key + ": ", e);
          reject(e);
        })
      resolve();
    });
  },

}

module.exports = ExtractReferences;
