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

const cliProgress = require("cli-progress");
const colors = require("ansi-colors");


var contenttypesConfig = config.modules.contentTypes,
  contentTypesFolderPath = path.resolve(
    config.data,
    contenttypesConfig.dirName
  ),
  masterFolderPath = path.resolve(config.data, "master", config.entryfolder);
var validKeys = contenttypesConfig.validKeys;
/**
 * Create folders and files
 */
mkdirp.sync(contentTypesFolderPath);
mkdirp.sync(masterFolderPath);
if (!fs.existsSync(contentTypesFolderPath)) {
  mkdirp.sync(contentTypesFolderPath);
  helper.writeFile(
    path.join(contentTypesFolderPath, contenttypesConfig.fileName)
  );
  mkdirp.sync(masterFolderPath);
  helper.writeFile(
    path.join(masterFolderPath, contenttypesConfig.masterfile),
    '{"en-us":{}}'
  );
}

const { drupalMapper } = require("./contentstackMapper")

function ExtractContentTypes() {
  this.master = {};
  this.priority = [];
  this.cycle = [];
  this.connection = helper.connect();
}

ExtractContentTypes.prototype = {
  customBar: null,
  initalizeLoader: function () {
    this.customBar = new cliProgress.SingleBar({
      format:
        "{title}|" +
        colors.cyan("{bar}") +
        "|  {percentage}%  || {value}/{total} completed",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
    });
  },
  destroyLoader: function () {
    if (this.customBar) {
      this.customBar.stop();
    }
  },
  start: function () {
    var self = this;
    this.initalizeLoader();

    return when.promise(function (resolve, reject) {
      self
        .getcontenttypes()
        .then(function (results) {
          for (var key in self.master) {
            self.detectCycle(key);
          }
          for (var key in self.master) {
            self.setPriority(key);
            self.cycle = [];
          }
          resolve();
        })
        .catch(function (error) {
          errorLogger(error);
          return reject();
        })
        .finally(function () {
          self.destroyLoader();
        });
    });
  },
  getcontenttypes: function () {
    var self = this;
    var details_data = [];
    return when.promise(function (resolve, reject) {
      var query = config["mysql-query"]["ct_mapped"];
      self.connection.query(query, function (error, rows, fields) {
        for (var i = 0; i < rows.length; i++) {
          var conv_details = phpUnserialize(rows[i].data);
          details_data.push({
            field_label: conv_details?.label,
            description: conv_details?.description,
            field_name: conv_details?.field_name,
            content_types: conv_details?.bundle,
            type: conv_details?.field_type,
            handler: conv_details?.settings?.handler,
            reference: conv_details?.settings?.handler_settings?.target_bundles,
            min: conv_details?.settings?.min,
            max: conv_details?.settings?.max,
            default_value: conv_details?.default_value[0]?.value
          });
        }
        if (!error) {
          if (details_data.length > 0) {
            self.putContentTypes(details_data, rows);
            self.connection.end();
            resolve();
          } else {
            self.connection.end();
            resolve();
          }
        } else {
          self.connection.end();
          reject(error);
        }
      });
    });
  },
  putContentTypes: function (contentdetails, contentTypeCount) {
    var self = this;
    var count = 0;

    return when.promise(function (resolve, reject) {
      var content_types = [];
      var ct = Object.keys(_.keyBy(contentdetails, "content_types"));

      ct.map(function (data, index) {
        var allkey = _.filter(contentdetails, { content_types: data });
        drupalMapper(allkey, ct);
        var contenttypeTitle = data.split("_").join(" ");

        var main = {
          title: contenttypeTitle,
          uid: data,
          schema: [...drupalMapper(allkey, ct)],
          description:
            `Schema for ${contenttypeTitle}`,
          options: {
            is_page: true,
            singleton: false,
            sub_title: [],
            title: `title`,
            url_pattern: "/:title",
            url_prefix: `/${contenttypeTitle
              .replace(/[^a-zA-Z0-9]+/g, "")
              .toLowerCase()}/`,
          },
        };
        count++;
        content_types.push(main);
      });
      var entry = {
        content_types: content_types,
      };

      self.putfield(entry, count);
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
      var contentTypeCount = count;
      if (authors) {
        contentTypeCount++;
      }
      if (taxonomy) {
        contentTypeCount++;
      }
      if (vocabulary) {
        contentTypeCount++;
      }
      self.customBar.start(contentTypeCount, 0, {
        title: "Migrating Content-type ",
      });

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
        // successLogger("ContentType " + contentType['uid'] + " successfully migrated")
        self.master[contentType['uid']] = temp;
        self.customBar.increment();
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
        refMapping[key]?.references?.map(function (ref, index) {
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

/*
 Find out file's
 */

module.exports = ExtractContentTypes;
