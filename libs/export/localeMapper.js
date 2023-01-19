const { locale } = require("./localeSchema");
function localeMapper(code) {

    switch (code) {
        case "af":
            return locale(code, "af-za", "Afrikaans - South Africa")
            break;
        case "be":
            return locale(code, "be-by", "Belarusian - Belarus")
            break;
        case "bg":
            return locale(code, "bg-bg", "Bulgarian - Bulgaria")
            break;
        case "bs":
            return locale(code, "bs", "Bosnian (Latin script)")
            break;
        case "ca":
            return locale(code, "ca-es", "Catalan - Catalan")
            break;
        case "cs":
            return locale(code, "cs", "Czech");
            break;
        case "da":
            return locale(code, "da-dk", "Danish - Denmark")
            break;
        case "el":
            return locale(code, "el-gr", "Greek - Greece")
            break;
        case "en":
            return locale(code, "en-us", "English - United States")
            break;
        case "en-x-simple":
            return locale(code, "en-us", "English - United States")
            break;
        case "es":
            return locale(code, "es", "Spanish");
            break;
        case "et":
            return locale(code, "et-ee", "Estonian - Estonia")
            break;
        case "eu":
            return locale(code, "eu-es", "Basque - Basque");
            break;
        case "fa":
            return locale(code, "fa-ir", "Farsi - Iran")
            break;
        case "fi":
            return locale(code, "fi", "Finnish")
            break;
        case "fil":
            return locale(code, "fil-ph", "Filipino - Philippines")
            break;
        case "fr":
            return locale(code, "fr", "French")
            break;
        case "gd":
            return locale(code, "gd", "Gaelic");
            break;
        case "gl":
            return locale(code, "gl-es", "gl-es");
            break;
        case "gsw-berne":
            return locale(code, "de-ch", "German - Switzerland")
            break;
        case "gu":
            return locale(code, "gu-in", "Gujarati - India")
            break;
        case "he":
            return locale(code, "he-il", "Hebrew - Israel")
            break;
        case "hi":
            return locale(code, "hi-in", "Hindi - India")
            break;
        case "hr":
            return locale(code, "hr-hr", "Croatian - Croatia")
            break;
        case "hu":
            return locale(code, "hu-hu", "Hungarian - Hungary")
            break;
        case "hy":
            return locale(code, "hy-am", "Armenian - Armenia")
            break;
        case "id":
            return locale(code, "id-id", "Indonesian - Indonesia")
            break;
        case "is":
            return locale(code, "is-is", "Icelandic - Iceland")
            break;
        case "it":
            return locale(code, "it", "Italian")
            break;
        case "js":
            return locale(code, "ja", "Japanese")
            break;
        case "ka":
            return locale(code, "ka-ge", "Georgian - Georgia")
            break;
        case "kk":
            return locale(code, "kk-kz", "Kazakh - Kazakhstan")
            break;
        case "km":
            return locale(code, "km-kh", "Khmer - Cambodia")
            break;
        case "kn":
            return locale(code, "kn-in", "Kannada - India")
            break;
        case "ko":
            return locale(code, "ko", "Korean")
            break;
        case "ky":
            return locale(code, "ky-kz", "Kyrgyz - Kazakhstan")
            break;
        case "lt":
            return locale(code, "lt-lt", "Lithuanian - Lithuania")
            break;
        case "lv":
            return locale(code, "lv-lv", "Latvian - Latvia")
            break;
        case "mk":
            return locale(code, "mk-mk", "Macedonian (FYROM)")
            break;
        case "mn":
            return locale(code, "mn-mn", "Mongolian - Mongolia")
            break;
        case "mr":
            return locale(code, "mr-in", "Marathi - India")
            break;
        case "ms":
            return locale(code, "my-mm", "Bahasa - Myanmar")
            break;
        case "nl":
            return locale(code, "nl-nl", "Dutch - The Netherlands")
            break;
        case "nb":
            return locale(code, "nb-no", "Norwegian (Bokmal) - Norway")
            break;
        case "nn":
            return locale(code, "nn-no", "Norwegian (Nynorsk) - Norway")
            break;
        case "pa":
            return locale(code, "pa-in", "Punjabi - India")
            break;
        case "pl":
            return locale(code, "pl-pl", "Polish - Poland")
            break;
        case "pt-pt":
            return locale(code, "pt-pt", "Portuguese - Portugal")
            break;
        case "pt-br":
            return locale(code, "pt-br", "Portuguese - Brazil")
            break;
        case "ro":
            return locale(code, "ro-ro", "Romanian - Romania")
            break;
        case "ru":
            return locale(code, "ru", "Russian")
            break;
        case "sk":
            return locale(code, "sk-sk", "Slovak - Slovakia")
            break;
        case "sl":
            return locale(code, "sl-si", "Slovenian - Slovenia")
            break;
        case "sq":
            return locale(code, "sq-al", "Albanian - Albania")
            break;
        case "sr":
            return locale(code, "sr-me", "Serbian - Montenegro")
            break;
        case "sv":
            return locale(code, "sv", "Swedish")
            break;
        case "sw":
            return locale(code, "sw-ke", "Swahili - Kenya")
            break;
        case "ta":
            return locale(code, "ta-in", "Tamil - India")
            break;
        case "ta-lk":
            return locale(code, "ta-in", "Tamil - India")
            break;
        case "te":
            return locale(code, "te-in", "Telugu - India")
            break;
        case "th":
            return locale(code, "th-th", "Thai - Thailand")
            break;
        case "tr":
            return locale(code, "tr-tr", "Turkish - Turkey")
            break;
        case "uk":
            return locale(code, "uk-ua", "Ukrainian - Ukraine")
            break;
        case "ur":
            return locale(code, "ur-pk", "Urdu - Pakistan")
            break;
        case "vi":
            return locale(code, "vi-vn", "Vietnamese - Vietnam")
            break;
        case "zh-hans":
            return locale(code, "zh-chs", "Chinese (Simplified)")
            break;
        case "zh-hant":
            return locale(code, "zh-cht", "Chinese (Traditional)")
            break;
        default:
            return locale(code, "en-us", "English - United States")
            break;
    }

}

module.exports = { localeMapper };