var mkdirp = require("mkdirp"),
  path = require("path"),
  fs = require("fs"),
  when = require("when"),
  guard = require("when/guard"),
  parallel = require("when/parallel"),
  sequence = require("when/sequence");
phpUnserialize = require("phpunserialize");

/**
 * Internal module Dependencies.
 */
var helper = require("../utils/helper");

var referencesConfig = config.modules.references,
  referencesFolderPath = path.resolve(config.data, referencesConfig.dirName),
  masterFolderPath = path.resolve(config.data, "master", config.entryfolder);
validKeys = referencesConfig.validKeys;
/**
 * Create folders and files
 */
mkdirp.sync(referencesFolderPath);
mkdirp.sync(masterFolderPath);
if (!fs.existsSync(referencesFolderPath)) {
  mkdirp.sync(referencesFolderPath);
  helper.writeFile(path.join(referencesFolderPath, referencesConfig.fileName));
  mkdirp.sync(masterFolderPath);
  helper.writeFile(path.join(referencesFolderPath, referencesConfig.fileName));
  helper.writeFile(
    path.join(masterFolderPath, referencesConfig.masterfile),
    '{"en-us":{}}'
  );
} else {
  helper.writeFile(path.join(referencesFolderPath, referencesConfig.fileName));
}

function ExtractReferences() {
  this.master = {};
  this.priority = [];
  this.cycle = [];
  this.connection = helper.connect();
}

ExtractReferences.prototype = {
  putPosts: function (postsdetails, key) {
    return when.promise(function (resolve, reject) {
      var referenceData = helper.readFile(
        path.join(
          process.cwd(),
          "/drupalMigrationData",
          "references",
          "references.json"
        )
      );
      postsdetails.map((data) => {
        referenceData[`content_type_entries_title_${data.nid}`] = {
          uid: `content_type_entries_title_${data.nid}`,
          _content_type_uid: key,
        };
        helper.writeFile(
          path.join(
            process.cwd(),
            "/drupalMigrationData",
            "references",
            "references.json"
          ),
          JSON.stringify(referenceData, null, 4)
        );
      });
      resolve();
    });
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
            self
              .putPosts(rows, pagename)
              .then(function (results) {
                resolve(results);
              })
              .catch(function () {
                reject();
              });
          } else {
            resolve();
          }
        } else {
          reject(error);
        }
      });
    });
  },
  getPageCount: function (pagename, queryPageConfig) {
    var self = this;
    return when.promise(function (resolve, reject) {
      var _getPage = [];
      for (var i = 0, total = 1; i < total; i += limit) {
        _getPage.push(
          (function (data) {
            return function () {
              return self.getQuery(pagename, data, queryPageConfig);
            };
          })(i)
        );
      }
      var guardTask = guard.bind(null, guard.n(1));
      _getPage = _getPage.map(guardTask);
      var taskResults = parallel(_getPage);
      taskResults
        .then(function (results) {
          resolve();
        })
        .catch(function (e) {
          errorLogger(
            "something wrong while exporting entries" + pagename + ":",
            e
          );
          self.connection.end();
          reject(e);
        });
    });
  },

  start: function () {
    successLogger("Exporting references...");

    var self = this;
    return when.promise(function (resolve, reject) {
      var queryPageConfig = helper.readFile(
        path.join(process.cwd(), "drupalMigrationData", "query", "index.json")
      );
      var pagequery = queryPageConfig.page;
      var _getPage = [];
      for (var key in pagequery) {
        _getPage.push(
          (function (key) {
            return function () {
              return self.getPageCount(key, queryPageConfig);
            };
          })(key)
        );
      }
      var taskResults = sequence(_getPage);
      taskResults
        .then(function (results) {
          self.connection.end();
          resolve();
        })
        .catch(function (e) {
          errorLogger(
            "something wrong while exporting entries " + key + ": ",
            e
          );
          reject(e);
        });
    });
  },
};

module.exports = ExtractReferences;
