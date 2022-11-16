var mkdirp = require("mkdirp"),
  path = require("path"),
  _ = require("lodash"),
  fs = require("fs"),
  when = require("when");
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
  masterFolderPath = path.resolve(config.data, "master", config.entryfolder);
validKeys = referencesConfig.validKeys;
/**
 * Create folders and files
 */
mkdirp.sync(referencesFolderPath);
mkdirp.sync(masterFolderPath);
if (!fs.existsSync(referencesFolderPath)) {
  mkdirp.sync(referencesFolderPath);
  helper.writeFile(
    path.join(referencesFolderPath, referencesConfig.fileName)
  );
  mkdirp.sync(masterFolderPath);
  helper.writeFile(
    path.join(referencesFolderPath, referencesConfig.fileName)
  )
  helper.writeFile(
    path.join(masterFolderPath, referencesConfig.masterfile),
    '{"en-us":{}}'
  );
} else {
  helper.writeFile(
    path.join(referencesFolderPath, referencesConfig.fileName)
  )
}

function ExtractReferences() {
  this.master = {};
  this.priority = [];
  this.cycle = [];
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
      var referenceData = helper.readFile(
        path.join(process.cwd(), "/drupalMigrationData/references/references.json")
      );

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

      // for(var pagename in queryPageConfig.page){

      //   var query = queryPageConfig["page"][""+pagename+""];
      //   var skip = 1;
      //   query = query + " limit " + skip + ", "+limit;
      //   self.connection.query(query, function (error, rows, fields) {
      //     if(error){
      //     }else{
      //       rows.map((data)=>{
      //         referenceData[`content_type_entries_title_${data.nid}`] = {
      //             uid: `content_type_entries_title_${data.nid}`,
      //             _content_type_uid: data.type,
      //           }
      //           helper.writeFile(
      //             path.join(process.cwd(), "/drupalMigrationData/references/references.json"),
      //             JSON.stringify(referenceData, null, 4)
      //           );
      //       })
      //     }
      //   })
      // }

      resolve();
    });
  },

  putfield: function (entry, count) {
    var self = this;
    return when.promise(function (resolve, reject) {
      var authors = helper.readFile(path.join(__dirname, "../authors.json"))
      var taxonomy = helper.readFile(path.join(__dirname, "../taxonomy.json"))
      var vocabulary = helper.readFile(path.join(__dirname, "../vocabulary.json"))
      helper.writeFile(path.join(contentTypesFolderPath, "taxonomy.json"), JSON.stringify(taxonomy, null, 4))
      helper.writeFile(path.join(contentTypesFolderPath, "vocabulary.json"), JSON.stringify(vocabulary, null, 4))
      helper.writeFile(path.join(contentTypesFolderPath, "authors.json"), JSON.stringify(authors, null, 4))
      entry.content_types.unshift(authors, vocabulary, taxonomy);

      count = count + 4
      for (var i = 0, total = count; i < total; i++) {
        var contentType = {},
          temp = {
            uid: '',
            references: [

            ],
            fields: {
              file: [],
              reference: []
            }
          };
        for (var j = 0, jTotal = validKeys.length; j < jTotal; j++) {
          contentType[validKeys[j]] = entry.content_types[i][validKeys[j]];
          if (validKeys[j] == 'uid') {
            temp['uid'] = contentType['uid'];
          } else if (validKeys[j] == 'schema') {
            temp['references'] = getFileFields(contentType['schema']);
            self.getReferenceAndFileFields(contentType['schema'], temp);
          }
        }
        helper.writeFile(path.join(contentTypesFolderPath, contentType['uid'] + '.json'), contentType);
        successLogger("ContentType " + contentType['uid'] + " successfully migrated")
        self.master[contentType['uid']] = temp;
        resolve();
      }
    })
  },
  getReferenceAndFileFields: function (schema, temp) {
    if (schema) {
      for (var i = 0, total = schema.length; i < total; i++) {
        switch (schema[i]['data_type']) {
          /* case 'reference':
           (temp['references'].indexOf(schema[i]['reference_to']) == -1) ? temp['references'].push(schema[i]['reference_to']) : '';*/
          case 'file':
            (temp['fields'][schema[i]['data_type']].indexOf(schema[i]['uid']) == -1) ? temp['fields'][schema[i]['data_type']].push(schema[i]['uid']) : '';
            break;
          case 'group':
            this.getReferenceAndFileFields(schema[i]['schema'], temp);
        }
      }
    }
  },
  setPriority: function (content_type_uid) {
    var self = this;
    self.cycle.push(content_type_uid);
    if (self.master[content_type_uid] && self.master[content_type_uid]['references'].length && self.priority.indexOf(content_type_uid) == -1) {
      for (var i = 0, total = self.master[content_type_uid]['references'].length; i < total; i++) {
        if (self.master[content_type_uid]['references'][i]['content_type_uid'] === content_type_uid || self.cycle.indexOf(content_type_uid) > -1) {
          //self.cycle = [];
          continue;
        }
        self.setPriority(self.master[content_type_uid]['references'][i]['content_type_uid']);
      }
    }
    if (self.priority.indexOf(content_type_uid) == -1) {
      self.priority.push(content_type_uid);
    }
  },
  detectCycle: function (content_type_uid) {
    try {
      var self = this;
      var refMapping = self.master;
      var seenObjects = [];
      var cyclicContentTypes = [];
      function detect(key) {
        seenObjects.push(key);
        refMapping[key]['references'].map(function (ref, index) {
          if (seenObjects.indexOf(ref.content_type_uid) == -1) {
            detect(ref.content_type_uid);
          } else {
            self.master[key]['references'][index]['isCycle'] = true;
            cyclicContentTypes.push(ref.content_type_uid);
            return seenObjects;
          }
        })
      }
      detect(content_type_uid);
      return cyclicContentTypes;
    } catch (e) {
      errorLogger(e)
    }
  }
};
function getFileFields(schema) {
  var references = [];

  var x = traverseSchemaWithPath(
    schema,
    function (path, entryPath, field) {
      if (field.data_type === "reference") {
        references.push({
          uid: field.uid,
          path: path,
          entryPath: entryPath,
          content_type_uid: field.reference_to,
        });
      }
    },
    false
  );

  return references;
}

/*
 Find out file's
 */
function traverseSchemaWithPath(schema, fn, path, entryPath) {
  path = path || "";
  entryPath = entryPath || "";

  function getPath(uid) {
    return _.isEmpty(path) ? uid : [path, uid].join(".");
  }

  function getEntryPath(uid) {
    return _.isEmpty(entryPath) ? uid : [entryPath, uid].join(".");
  }

  var promises = schema.map(function (field, index) {
    var pth = getPath("schema[" + index + "]");
    var entryPth = "";
    field.data_type === "group" && field.multiple
      ? (entryPth = getEntryPath(field.uid) + "[]")
      : (entryPth = getEntryPath(field.uid));
    if (field.data_type === "group") {
      return traverseSchemaWithPath(field.schema, fn, pth, entryPth);
    }

    return fn(pth, entryPth, field);
  });

  return _.flatten(_.compact(promises));
};

module.exports = ExtractReferences;
