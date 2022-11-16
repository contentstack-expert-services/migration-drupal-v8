const { locale } = require("./localeSchema");
function localeMapper(value) {

    switch (value) {
        case "af":
            return locale("af-za", "Afrikaans - South Africa")
            break;
        case "be":
            return locale("be-by", "Belarusian - Belarus")
            break;
        case "bg":
            return locale("bg-bg", "Bulgarian - Bulgaria")
            break;
        case "bs":
            return locale("bs", "Bosnian (Latin script)")
            break;
        case "ca":
            return locale("ca-es", "Catalan - Catalan")
            break;
        case "cs":
            return locale("cs", "Czech");
            break;
        case "da":
            return locale("da-dk", "Danish - Denmark")
            break;
        case "el":
            return locale("el-gr", "Greek - Greece")
            break;
        case "en":
            return locale("en-us", "English - United States")
            break;
        case "en-x-simple":
            return locale("en-us", "English - United States")
            break;
        case "es":
            return locale("es", "Spanish");
            break;
        case "et":
            return locale("et-ee", "Estonian - Estonia")
            break;
        case "eu":
            return locale("eu-es", "Basque - Basque");
            break;
        case "fa":
            return locale("fa-ir", "Farsi - Iran")
            break;
        case "fi":
            return locale("fi", "Finnish")
            break;
        case "fil":
            return locale("fil-ph", "Filipino - Philippines")
            break;
        case "fr":
            return locale("fr", "French")
            break;
        case "gd":
            return locale("gd", "Gaelic");
            break;
        case "gl":
            return locale("gl-es", "gl-es");
            break;
        case "gsw-berne":
            return locale("de-ch", "German - Switzerland")
            break;
        case "gu":
            return locale("gu-in", "Gujarati - India")
            break;
        case "he":
            return locale("he-il", "Hebrew - Israel")
            break;
        case "hi":
            return locale("hi-in", "Hindi - India")
            break;
        case "hr":
            return locale("hr-hr", "Croatian - Croatia")
            break;
        case "hu":
            return locale("hu-hu", "Hungarian - Hungary")
            break;
        case "hy":
            return locale("hy-am", "Armenian - Armenia")
            break;
        case "id":
            return locale("id-id", "Indonesian - Indonesia")
            break;
        case "is":
            return locale("is-is", "Icelandic - Iceland")
            break;
        case "it":
            return locale("it", "Italian")
            break;
        case "js":
            return locale("ja", "Japanese")
            break;
        case "ka":
            return locale("ka-ge", "Georgian - Georgia")
            break;
        case "kk":
            return locale("kk-kz", "Kazakh - Kazakhstan")
            break;
        case "km":
            return locale("km-kh", "Khmer - Cambodia")
            break;
        case "kn":
            return locale("kn-in", "Kannada - India")
            break;
        case "ko":
            return locale("ko", "Korean")
            break;
        case "ky":
            return locale("ky-kz", "Kyrgyz - Kazakhstan")
            break;
        case "lt":
            return locale("lt-lt", "Lithuanian - Lithuania")
            break;
        case "lv":
            return locale("lv-lv", "Latvian - Latvia")
            break;
        case "mk":
            return locale("mk-mk", "Macedonian (FYROM)")
            break;
        case "mn":
            return locale("mn-mn", "Mongolian - Mongolia")
            break;
        case "mr":
            return locale("mr-in", "Marathi - India")
            break;
        case "ms":
            return locale("my-mm", "Bahasa - Myanmar")
            break;
        case "nl":
            return locale("nl-nl", "Dutch - The Netherlands")
            break;
        case "nb":
            return locale("nb-no", "Norwegian (Bokmal) - Norway")
            break;
        case "nn":
            return locale("nn-no", "Norwegian (Nynorsk) - Norway")
            break;
        case "pa":
            return locale("pa-in", "Punjabi - India")
            break;
        case "pl":
            return locale("pl-pl", "Polish - Poland")
            break;
        case "pt-pt":
            return locale("pt-pt", "Portuguese - Portugal")
            break;
        case "pt-br":
            return locale("pt-br", "Portuguese - Brazil")
            break;
        case "ro":
            return locale("ro-ro", "Romanian - Romania")
            break;
        case "ru":
            return locale("ru", "Russian")
            break;
        case "sk":
            return locale("sk-sk", "Slovak - Slovakia")
            break;
        case "sl":
            return locale("sl-si", "Slovenian - Slovenia")
            break;
        case "sq":
            return locale("sq-al", "Albanian - Albania")
            break;
        case "sr":
            return locale("sr-me", "Serbian - Montenegro")
            break;
        case "sv":
            return locale("sv", "Swedish")
            break;
        case "sw":
            return locale("sw-ke", "Swahili - Kenya")
            break;
        case "ta":
            return locale("ta-in", "Tamil - India")
            break;
        case "ta-lk":
            return locale("ta-in", "Tamil - India")
            break;
        case "te":
            return locale("te-in", "Telugu - India")
            break;
        case "th":
            return locale("th-th", "Thai - Thailand")
            break;
        case "tr":
            return locale("tr-tr", "Turkish - Turkey")
            break;
        case "uk":
            return locale("uk-ua", "Ukrainian - Ukraine")
            break;
        case "ur":
            return locale("ur-pk", "Urdu - Pakistan")
            break;
        case "vi":
            return locale("vi-vn", "Vietnamese - Vietnam")
            break;
        case "zh-hans":
            return locale("zh-chs", "Chinese (Simplified)")
            break;
        case "zh-hant":
            return locale("zh-cht", "Chinese (Traditional)")
            break;
        default:
            return locale("en-us", "English - United States")
            break;
    }

}

module.exports = { localeMapper };