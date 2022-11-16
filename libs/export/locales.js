var mkdirp = require("mkdirp"),
  path = require("path"),
  fs = require("fs"),
  when = require("when");

var helper = require("./../utils/helper");
var localeConfig = config.modules.locales.fileName,
  localeFolderPath = path.resolve(
    config.data,
    config.modules.locales.dirName
  );

if (!fs.existsSync(localeFolderPath)) {
  mkdirp.sync(localeFolderPath);
  helper.writeFile(path.join(localeFolderPath, localeConfig));
}

function ExtractLocale() {
  helper.writeFile(path.join(localeFolderPath, localeConfig));
}

ExtractLocale.prototype = {
  saveLocale: function (locale) {
    var self = this;
    return when.promise(function (resolve, reject) {
      var localeJSON = helper.readFile(
        path.join(localeFolderPath, localeConfig)
      );
      var title = "locale_123";
      localeJSON[title] = {
        code: "en-us",
        name: "English - United States",
        fallback_locale: "",
        uid: `${title}`,
      };
      helper.writeFile(
        path.join(localeFolderPath, localeConfig),
        JSON.stringify(localeJSON, null, 4)
      );
      successLogger(`exported locale successfully`);
      resolve(locale);
    });
  },
  start: function () {
    var self = this;
    return when.promise(function (resolve, reject) {
      self
        .saveLocale()
        .then(function () {
          resolve();
        })
        .catch(function () {
          reject();
        });
    });
  },
};

module.exports = ExtractLocale;
