global.config = require("./../../config")

function locale(d_code, cs_code, name) {

    var uid = `locale_${cs_code.replace("-","_")}`
    let returnLocale = {};
    let fallbackLocale = [];

    if(global.config.drupal_master_language !== d_code){
        switch (global.config.drupal_master_language) {
            case "af":
                fallbackLocale.push("af-za")
                break;
            case "be":
                fallbackLocale.push("be-by")
                break;
            case "bg":
                fallbackLocale.push("bg-bg")
                break;
            case "bs":
                fallbackLocale.push("bs")
                break;
            case "ca":
                fallbackLocale.push("ca-es")
                break;
            case "cs":
                fallbackLocale.push("cs");
                break;
            case "da":
                fallbackLocale.push("da-dk")
                break;
            case "el":
                fallbackLocale.push("el-gr")
                break;
            case "en":
                fallbackLocale.push("en-us")
                break;
            case "en-x-simple":
                fallbackLocale.push("en-us")
                break;
            case "es":
                fallbackLocale.push("es");
                break;
            case "et":
                fallbackLocale.push("et-ee")
                break;
            case "eu":
                fallbackLocale.push("eu-es");
                break;
            case "fa":
                fallbackLocale.push("fa-ir")
                break;
            case "fi":
                fallbackLocale.push("fi")
                break;
            case "fil":
                fallbackLocale.push("fil-ph")
                break;
            case "fr":
                fallbackLocale.push("fr")
                break;
            case "gd":
                fallbackLocale.push("gd");
                break;
            case "gl":
                fallbackLocale.push("gl-es");
                break;
            case "gsw-berne":
                fallbackLocale.push("de-ch")
                break;
            case "gu":
                fallbackLocale.push("gu-in")
                break;
            case "he":
                fallbackLocale.push("he-il")
                break;
            case "hi":
                fallbackLocale.push("hi-in")
                break;
            case "hr":
                fallbackLocale.push("hr-hr")
                break;
            case "hu":
                fallbackLocale.push("hu-hu")
                break;
            case "hy":
                fallbackLocale.push("hy-am")
                break;
            case "id":
                fallbackLocale.push("id-id")
                break;
            case "is":
                fallbackLocale.push("is-is")
                break;
            case "it":
                fallbackLocale.push("it")
                break;
            case "js":
                fallbackLocale.push("ja")
                break;
            case "ka":
                fallbackLocale.push("ka-ge")
                break;
            case "kk":
                fallbackLocale.push("kk-kz")
                break;
            case "km":
                fallbackLocale.push("km-kh")
                break;
            case "kn":
                fallbackLocale.push("kn-in")
                break;
            case "ko":
                fallbackLocale.push("ko")
                break;
            case "ky":
                fallbackLocale.push("ky-kz")
                break;
            case "lt":
                fallbackLocale.push("lt-lt")
                break;
            case "lv":
                fallbackLocale.push("lv-lv")
                break;
            case "mk":
                fallbackLocale.push("mk-mk")
                break;
            case "mn":
                fallbackLocale.push("mn-mn")
                break;
            case "mr":
                fallbackLocale.push("mr-in")
                break;
            case "ms":
                fallbackLocale.push("my-mm")
                break;
            case "nl":
                fallbackLocale.push("nl-nl")
                break;
            case "nb":
                fallbackLocale.push("nb-no")
                break;
            case "nn":
                fallbackLocale.push("nn-no")
                break;
            case "pa":
                fallbackLocale.push("pa-in")
                break;
            case "pl":
                fallbackLocale.push("pl-pl")
                break;
            case "pt-pt":
                fallbackLocale.push("pt-pt")
                break;
            case "pt-br":
                fallbackLocale.push("pt-br")
                break;
            case "ro":
                fallbackLocale.push("ro-ro")
                break;
            case "ru":
                fallbackLocale.push("ru")
                break;
            case "sk":
                fallbackLocale.push("sk-sk")
                break;
            case "sl":
                fallbackLocale.push("sl-si")
                break;
            case "sq":
                fallbackLocale.push("sq-al")
                break;
            case "sr":
                fallbackLocale.push("sr-me")
                break;
            case "sv":
                fallbackLocale.push("sv")
                break;
            case "sw":
                fallbackLocale.push("sw-ke")
                break;
            case "ta":
                fallbackLocale.push("ta-in")
                break;
            case "ta-lk":
                fallbackLocale.push("ta-in")
                break;
            case "te":
                fallbackLocale.push("te-in")
                break;
            case "th":
                fallbackLocale.push("th-th")
                break;
            case "tr":
                fallbackLocale.push("tr-tr")
                break;
            case "uk":
                fallbackLocale.push("uk-ua")
                break;
            case "ur":
                fallbackLocale.push("ur-pk")
                break;
            case "vi":
                fallbackLocale.push("vi-vn")
                break;
            case "zh-hans":
                fallbackLocale.push("zh-chs")
                break;
            case "zh-hant":
                fallbackLocale.push("zh-cht")
                break;
            default:
                fallbackLocale.push("en-us")
                break;
        }
    }

    returnLocale[uid] =
    {
        "code": cs_code,
        "name": name,
        "fallback_locale": fallbackLocale.join(),
        "uid": uid
    }

    return returnLocale;
}


module.exports = { locale }