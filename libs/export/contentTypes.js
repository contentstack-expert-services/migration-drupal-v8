var mkdirp = require("mkdirp"),
  path = require("path"),
  _ = require("lodash"),
  fs = require("fs"),
  when = require("when"),
  phpUnserialize = require("phpunserialize"),
  chalk = require("chalk");

/**
 * Internal module Dependencies.
 */
var helper = require("../utils/helper");

var contenttypesConfig = config.modules.contentTypes,
  contentTypesFolderPath = path.resolve(
    config.data,
    contenttypesConfig.dirName
  );

var validKeys = contenttypesConfig.validKeys;
/**
 * Create folders and files
 */
mkdirp.sync(contentTypesFolderPath);

if (!fs.existsSync(contentTypesFolderPath)) {
  mkdirp.sync(contentTypesFolderPath);
  helper.writeFile(
    path.join(contentTypesFolderPath, contenttypesConfig.fileName)
  );
}

const { drupalMapper } = require("./contentstackMapper");

function ExtractContentTypes() {
  this.master = {};
  this.priority = [];
  this.cycle = [];
  this.connection = helper.connect();
}

ExtractContentTypes.prototype = {
  start: function () {
    successLogger("Exporting content-types...");
    var self = this;

    return when.promise(function (resolve, reject) {
      self
        .getcontenttypes()
        .then(function (results) {
          successLogger(
            "Updated priority and reference/file field of Content Types."
          );
          resolve();
        })
        .catch(function (error) {
          errorLogger(error);
          return reject();
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
            default_value: conv_details?.default_value[0]?.value,
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
          description: `Schema for ${contenttypeTitle}`,
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
      var authors = helper.readFile(path.join(__dirname, "../authors.json"));
      var taxonomy = helper.readFile(path.join(__dirname, "../taxonomy.json"));
      var vocabulary = helper.readFile(
        path.join(__dirname, "../vocabulary.json")
      );
      helper.writeFile(
        path.join(contentTypesFolderPath, "taxonomy.json"),
        JSON.stringify(taxonomy, null, 4)
      );
      helper.writeFile(
        path.join(contentTypesFolderPath, "vocabulary.json"),
        JSON.stringify(vocabulary, null, 4)
      );
      helper.writeFile(
        path.join(contentTypesFolderPath, "authors.json"),
        JSON.stringify(authors, null, 4)
      );
      entry.content_types.unshift(authors, vocabulary, taxonomy);

      count = count + 4;
      for (var i = 0, total = count; i < total; i++) {
        var contentType = {};

        for (var j = 0, jTotal = validKeys.length; j < jTotal; j++) {
          contentType[validKeys[j]] = entry.content_types[i][validKeys[j]];
        }
        helper.writeFile(
          path.join(contentTypesFolderPath, contentType["uid"] + ".json"),
          contentType
        );
        console.log(
          "ContentType",
          chalk.green(`${contentType["uid"]}`),
          "created successfully"
        );
        resolve();
      }
    });
  },
};

/*
 Find out file's
 */

module.exports = ExtractContentTypes;
