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

const cliProgress = require("cli-progress");
const colors = require("ansi-colors");


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
        .finally(function(){
          resolve();
        })
    });
  },
  getLocale: function () {
    var self = this;
    let localeCode = [];
    return when.promise(function (resolve, reject) {
      var query = config["mysql-query"]["ct_mapped"];
      self.connection.query(query, function (error, rows, fields) {
        for (var i = 0; i < rows.length; i++) {
          var conv_details = phpUnserialize(rows[i].data);
          localeCode = _.union([conv_details?.langcode], localeCode)
        }
        localeMapper(localeCode.join())
        let localeDetail = localeMapper(localeCode.join())

        helper.writeFile(
          path.join(localeFolderPath, localeConfig.fileName),
          JSON.stringify(localeMapper(localeCode.join()), null, 4)
        );
        console.log("\nExported master locale successfully from Drupal with code ", chalk.green(`${localeDetail.locale_123.code} `), "and language name as ", chalk.green(`${localeDetail.locale_123.name}\n`));
        resolve();
      });
    });
  }
};

module.exports = ExtractLocales;
