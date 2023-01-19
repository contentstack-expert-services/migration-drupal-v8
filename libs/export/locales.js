var mkdirp = require("mkdirp"),
  path = require("path"),
  _ = require("lodash"),
  fs = require("fs"),
  when = require("when");
phpUnserialize = require("phpunserialize")

const chalk = require("chalk");


/**
 * Internal module Dependencies.
 */
var helper = require("../utils/helper");
let localeList = [];


var localeConfig = config.modules.locales
var localeFolderPath = path.resolve(
  config.data,
  localeConfig.dirName
)
/**
 * Create folders and files
 */
mkdirp.sync(localeFolderPath);
if (!fs.existsSync(localeFolderPath)) {
  mkdirp.sync(localeFolderPath);
  helper.writeFile(
    path.join(localeFolderPath, localeConfig.fileName)
  );
}
const { localeMapper } = require("./localeMapper")

function ExtractLocales() {
  this.connection = helper.connect();
  helper.writeFile(
    path.join(localeFolderPath, localeConfig.fileName)
  );
}

ExtractLocales.prototype = {
  start: function () {
    var self = this;

    return when.promise(function (resolve, reject) {
      self
        .getLocale()
        .then(function (results) {
          self.connection.end();
          resolve();
        })
        .catch(function (error) {
          self.connection.end();
          errorLogger(error);
          return reject();
        })
        .finally(function () {
          resolve();
        });
    });
  },
  getLocaleCountQuery: function (key, queryLocaleConfig) {
    var self = this;
    let localeCode = [];
    var query = queryLocaleConfig["page"]["" + key + ""];

    return when.promise(function (resolve, reject) {
      self.connection.query(query, function (error, rows, fields) {

        for (var i = 0; i < rows.length; i++) {
          localeCode = _.union([rows[i]?.langcode], localeCode)
          localeCode = localeCode.filter(e => e !== global.config.drupal_master_language)
        }
        // let localeList = [];

        for (const value of localeCode) {
          localeList.push(localeMapper(value))
        }

        // console.log("localeList ", localeList);
        if (localeList.length > 0) {
          fs.writeFileSync(
            path.join(localeFolderPath, localeConfig.fileName),
            JSON.stringify(Object.assign({}, ...localeList), null, 4),
            { 'flags': 'a+' }
          );
        }
        resolve();
      });
      resolve();

    });

  }
  ,
  getLocale: function () {
    var self = this;
    return when.promise(function (resolve, reject) {
      var queryLocaleConfig = helper.readFile(
        path.join(process.cwd(), "/drupalMigrationData/query/index.json")
      );

      var _getLocale = [];
      for (var key in queryLocaleConfig.page) {
        _getLocale.push(function (key) {
          return self.getLocaleCountQuery(key, queryLocaleConfig)
        }(key));
      }
      console.log(chalk.green("Locales exported successfully."));
      resolve();
    });
  }
};

module.exports = ExtractLocales;
