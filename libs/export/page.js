/**
 * Updated by Rohit on 1/10/19.
 */
 var mkdirp = require('mkdirp'),
 path = require('path'),
 _ = require('lodash'),
 url = require('url'),
 fs = require('fs')
when = require('when'),
 guard = require('when/guard'),
 parallel = require('when/parallel'),
 sequence = require('when/sequence'),
 async = require('async'),
 limit = 3;
var asyncLoop = require('node-async-loop');

/**
* Internal module Dependencies.
*/
const { JSDOM } = require("jsdom");
const { htmlToJson } = require("@contentstack/json-rte-serializer");
const cliProgress = require("cli-progress");
const colors = require("ansi-colors");

var helper = require('../../libs/utils/helper.js');

var entriesConfig = config.modules.entries,
 entriesFolderPath = path.resolve(config.data, entriesConfig.dirName);
function ExtractPosts() {
 this.connection = helper.connect();
}

ExtractPosts.prototype = {
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
 putPosts: function (postsdetails, key, countentry) {
     var self = this;

     var folderpath = entriesFolderPath + '/' + key;
     masterFolderPath = path.resolve(config.data, 'master', config.entryfolder);
     if (!fs.existsSync(folderpath)) {
         mkdirp.sync(folderpath);
         helper.writeFile(path.join(folderpath, "en-us.json"))
         mkdirp.sync(masterFolderPath);
         helper.writeFile(path.join(masterFolderPath, key + '.json'), '{"en-us":{}}')
     }
     var contenttype = helper.readFile(path.join(folderpath, "en-us.json"));
     var mastercontenttype = helper.readFile(path.join(masterFolderPath, key + ".json"));
     return when.promise(function (resolve, reject) {
         self.customBar.start(countentry, 0, {
             title: `Migrating Entries of ${key} `,
         });
         var field_name = Object.keys(postsdetails[0]);
         var isoDate = new Date();
         var contentTypeQuery = config["mysql-query"]["ct_mapped"];
         let assetId = helper.readFile(
             path.join(process.cwd(), "drupalMigrationData/assets/assets.json")
         );
         let referenceId = helper.readFile(
             path.join(process.cwd(), "drupalMigrationData/references/references.json")
         );
         let taxonomyId = helper.readFile(
             path.join(process.cwd(), "drupalMigrationData/entries/taxonomy/en-us.json")
         );
         self.connection.query(contentTypeQuery, function (error, rows, fields) {
             for (var i = 0; i < rows.length; i++) {
                 var conv_details = phpUnserialize(rows[i].data);
                 for (const [Fieldkey, data] of Object.entries(postsdetails)) {
                     for (const [dataKey, value] of Object.entries(data)) {

                         //for image and files 
                         if (conv_details.field_type === "file" || conv_details.field_type === "image") {
                             if (dataKey === `${conv_details.field_name}_target_id` && (conv_details.field_type === "file" || conv_details.field_type === "image")) {
                                 if (`assets_${value}` in assetId && dataKey === `${conv_details.field_name}_target_id` && (conv_details.field_type === "file" || conv_details.field_type === "image")) {
                                     data[dataKey] = assetId[`assets_${value}`]
                                 }
                             }
                         }

                         // for references
                         if (conv_details.field_type === "entity_reference") {
                             if (conv_details?.settings?.handler === "default:taxonomy_term" && (typeof value === "number") && (dataKey === `${conv_details.field_name}_target_id`)) {
                                 if (`taxonomy_${value}` in taxonomyId && (conv_details?.settings?.handler === "default:taxonomy_term" && (typeof value === "number"))) {
                                     data[dataKey] = [{
                                         uid: `taxonomy_${value}`,
                                         _content_type_uid: "taxonomy"
                                     }]
                                 }
                             }
                             if (conv_details?.settings?.handler === "default:node" && ((typeof value === "number") && (dataKey === `${conv_details.field_name}_target_id`))) {
                                 if ((typeof value === "number") && (dataKey === `${conv_details.field_name}_target_id`)) {
                                     if (`content_type_entries_title_${value}` in referenceId) {
                                         data[dataKey] = [referenceId[`content_type_entries_title_${value}`]]
                                     }
                                 }
                             }
                         }

                         // for datetime and timestamps
                         if (conv_details.field_type === "datetime" || conv_details.field_type === "timestamp") {
                             if (`${conv_details.field_name}_value` === dataKey) {
                                 data[dataKey] = isoDate.toISOString(value)
                             }
                         }

                         if(conv_details.field_type === "boolean"){
                             if(dataKey === `${conv_details.field_name}_value` && typeof value === "number"){
                                 if(typeof value === "number" && value === 1){
                                     data[dataKey] = true;
                                 }else if(typeof value === "number" && value === 0){
                                     data[dataKey] = false;
                                 }
                             }
                         }

                         if(conv_details.field_type === "comment"){
                             if(dataKey === `${conv_details.field_name}_status` && typeof value === "number"){
                                 data[dataKey] = `${value}`
                             }
                         }

                         if (value === null) {
                             delete data[dataKey];
                         }
                     }

                     var ct_value = {};
                     var date;

                     for (var key in field_name) {
                         var re = field_name[key].endsWith("_tid");
                         if (field_name[key] == "created") {
                             date = new Date(data[field_name[key]] * 1000);
                             ct_value[field_name[key]] = date.toDateString()
                         }
                         else if (field_name[key] == "uid_name") {
                             ct_value[field_name[key]] = [data[field_name[key]]]
                         }
                         else if (re) {
                             ct_value[field_name[key]] = [data[field_name[key]]]
                         }
                         else if (field_name[key] == "nid") {
                             ct_value.uid = `content_type_entries_title_${data["nid"]}`
                         } else if (field_name[key] == "langcode") {
                             ct_value.locale = "en-us"
                         } else if(field_name[key].endsWith("_uri")){
                             if(data[field_name[key]]){
                                 ct_value[field_name[key].replace("_uri","")] = {
                                     "title": data[field_name[key]],
                                     "href": data[field_name[key]]
                                 }
                             }else{
                                 ct_value[field_name[key].replace("_uri","")] = {
                                     "title": "",
                                     "href": ""
                                 }
                             }
                         }else if(field_name[key].endsWith("_value")){
                             if (/<\/?[a-z][\s\S]*>/i.test(data[field_name[key]])) {
                                 const dom = new JSDOM(data[field_name[key]]);
                                 let htmlDoc = dom.window.document.querySelector("body");
                                 const jsonValue = htmlToJson(htmlDoc);
                                 ct_value[field_name[key].replace("_value","")] = jsonValue;
                             } else {
                                 ct_value[field_name[key].replace("_value","")] = data[field_name[key]]
                             }
                         }
                         else if(field_name[key].endsWith("_status")){
                             ct_value[field_name[key].replace("_status","")] = data[field_name[key]]
                         }
                          else {
                             if (/<\/?[a-z][\s\S]*>/i.test(data[field_name[key]])) {
                                 const dom = new JSDOM(data[field_name[key]]);
                                 let htmlDoc = dom.window.document.querySelector("body");
                                 const jsonValue = htmlToJson(htmlDoc);
                                 ct_value[field_name[key]] = jsonValue;
                             } else {
                                 ct_value[field_name[key]] = data[field_name[key]]
                             }
                         }

                         if (typeof data["nid"] === "number") {
                             contenttype[`content_type_entries_title_${data["nid"]}`] = ct_value
                         }
                         mastercontenttype["en-us"][data["nid"]] = ""
                     }
                 }

                 helper.writeFile(path.join(folderpath, 'en-us.json'), JSON.stringify(contenttype, null, 4))
                 helper.writeFile(path.join(masterFolderPath, key + '.json'), JSON.stringify(mastercontenttype, null, 4))
                 self.customBar.increment();
                 resolve({ last: contenttype })
             }
         })
     })
 },
 getQuery: function (pagename, skip, queryPageConfig, countentry) {
     var self = this;
     return when.promise(function (resolve, reject) {
         var query = queryPageConfig["page"]["" + pagename + ""];
         query = query + " limit " + skip + ", " + limit;
         self.connection.query(query, function (error, rows, fields) {
             if (!error) {
                 if (rows.length > 0) {
                     self.putPosts(rows, pagename, countentry)
                         .then(function (results) {
                             resolve(results);
                         })
                         .catch(function () {
                             reject()
                         })
                 }
                 else {
                     errorLogger("no entries found");
                     resolve();
                 }
             } else {
                 errorLogger('failed to get entries: ', error);
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
                     return self.getQuery(pagename, data, queryPageConfig, countentry);
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
                     errorLogger("no entries found for " + pagename + " ...");
                     resolve();
                 }
             } else {
                 errorLogger("failed to get " + pagename + " count: ", error);
                 reject(error)
             }
         })
     })
 },
 getAllPosts: function () {
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
 start: function () {
     successLogger("Exporting entries...");
     var self = this;
     this.initalizeLoader();

     return when.promise(function (resolve, reject) {
         self.getAllPosts()
             .then(function () {
                 resolve()
             })
             .catch(function () {
                 reject()
             })
             .finally(function () {
                 self.destroyLoader();
             });
     })
 }
}

module.exports = ExtractPosts;