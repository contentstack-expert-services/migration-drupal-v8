const { locale } = require("./localeSchema");
function localeMapper(value) {

    let localSchema = [];
    switch (value) {
        case "af":
            localSchema.push(locale("af-za", "Afrikaans - South Africa"))
            break;
        case "be":
            localSchema.push(locale("be-by", "Belarusian - Belarus"))
            break;
        case "bg":
            localSchema.push(locale("bg-bg", "Bulgarian - Bulgaria"))
            break;
        case "bs":
            localSchema.push(locale("bs", "Bosnian (Latin script)"))
            break;
        case "ca":
            localSchema.push(locale("ca-es", "Catalan - Catalan"))
            break;
        case "cs":
            localSchema.push(locale("cs", "Czech"))
            break;
        case "da":
            localSchema.push(locale("da-dk", "Danish - Denmark"))
            break;
        case "el":
            localSchema.push(locale("el-gr", "Greek - Greece"))
            break;
        case "en":
            localSchema.push(locale("en-us", "English - United States"))
            break;
        case "en-x-simple":
            localSchema.push(locale("en-us", "English - United States"))
            break;
        case "es":
            localSchema.push(locale("es", "Spanish"))
            break;
        case "et":
            localSchema.push(locale("et-ee", "Estonian - Estonia"))
            break;
        case "eu":
            localSchema.push(locale("eu-es", "Basque - Basque"))
            break;
        case "fa":
            localSchema.push(locale("fa-ir", "Farsi - Iran"))
            break;
        case "fi":
            localSchema.push(locale("fi", "Finnish"))
            break;
        case "fil":
            localSchema.push(locale("fil-ph", "Filipino - Philippines"))
            break;
        case "fr":
            localSchema.push(locale("fr", "French"))
            break;
        case "gd":
            localSchema.push(locale("gd", "Gaelic"))
            break;
        case "gl":
            localSchema.push(locale("gl-es", "gl-es"))
            break;
        case "gsw-berne":
            localSchema.push(locale("de-ch", "German - Switzerland"))
            break;
        case "gu":
            localSchema.push(locale("gu-in", "Gujarati - India"))
            break;
        case "he":
            localSchema.push(locale("he-il", "Hebrew - Israel"))
            break;
        case "hi":
            localSchema.push(locale("hi-in", "Hindi - India"))
            break;
        case "hr":
            localSchema.push(locale("hr-hr", "Croatian - Croatia"))
            break;
        case "hu":
            localSchema.push(locale("hu-hu", "Hungarian - Hungary"))
            break;
        case "hy":
            localSchema.push(locale("hy-am", "Armenian - Armenia"))
            break;
        case "id":
            localSchema.push(locale("id-id", "Indonesian - Indonesia"))
            break;
        case "is":
            localSchema.push(locale("is-is", "Icelandic - Iceland"))
            break;
        case "it":
            localSchema.push(locale("it", "Italian"))
            break;
        case "js":
            localSchema.push(locale("ja", "Japanese"))
            break;
        case "ka":
            localSchema.push(locale("ka-ge", "Georgian - Georgia"))
            break;
        case "kk":
            localSchema.push(locale("kk-kz", "Kazakh - Kazakhstan"))
            break;
        case "km":
            localSchema.push(locale("km-kh", "Khmer - Cambodia"))
            break;
        case "kn":
            localSchema.push(locale("kn-in", "Kannada - India"))
            break;
        case "ko":
            localSchema.push(locale("ko", "Korean"))
            break;
        case "ky":
            localSchema.push(locale("ky-kz", "Kyrgyz - Kazakhstan"))
            break;
        case "lt":
            localSchema.push(locale("lt-lt", "Lithuanian - Lithuania"))
            break;
        case "lv":
            localSchema.push(locale("lv-lv", "Latvian - Latvia"))
            break;
        case "mk":
            localSchema.push(locale("mk-mk", "Macedonian (FYROM)"))
            break;
        case "mn":
            localSchema.push(locale("mn-mn", "Mongolian - Mongolia"))
            break;
        case "mr":
            localSchema.push(locale("mr-in", "Marathi - India"))
            break;
        case "ms":
            localSchema.push(locale("my-mm", "Bahasa - Myanmar"))
            break;
        case "nl":
            localSchema.push(locale("nl-nl", "Dutch - The Netherlands"))
            break;
        case "nb":
            localSchema.push(locale("nb-no", "Norwegian (Bokmal) - Norway"))
            break;
        case "nn":
            localSchema.push(locale("nn-no", "Norwegian (Nynorsk) - Norway"))
            break;
        case "pa":
            localSchema.push(locale("pa-in", "Punjabi - India"))
            break;
        case "pl":
            localSchema.push(locale("pl-pl", "Polish - Poland"))
            break;
        case "pt-pt":
            localSchema.push(locale("pt-pt", "Portuguese - Portugal"))
            break;
        case "pt-br":
            localSchema.push(locale("pt-br", "Portuguese - Brazil"))
            break;
        case "ro":
            localSchema.push(locale("ro-ro", "Romanian - Romania"))
            break;
        case "ru":
            localSchema.push(locale("ru", "Russian"))
            break;
        case "sk":
            localSchema.push(locale("sk-sk", "Slovak - Slovakia"))
            break;
        case "sl":
            localSchema.push(locale("sl-si", "Slovenian - Slovenia"))
            break;
        case "sq":
            localSchema.push(locale("sq-al", "Albanian - Albania"))
            break;
        case "sr":
            localSchema.push(locale("sr-me", "Serbian - Montenegro"))
            break;
        case "sv":
            localSchema.push(locale("sv", "Swedish"))
            break;
        case "sw":
            localSchema.push(locale("sw-ke", "Swahili - Kenya"))
            break;
        case "ta":
            localSchema.push(locale("ta-in", "Tamil - India"))
            break;
        case "ta-lk":
            localSchema.push(locale("ta-in", "Tamil - India"))
            break;
        case "te":
            localSchema.push(locale("te-in", "Telugu - India"))
            break;
        case "th":
            localSchema.push(locale("th-th", "Thai - Thailand"))
            break;
        case "tr":
            localSchema.push(locale("tr-tr", "Turkish - Turkey"))
            break;
        case "uk":
            localSchema.push(locale("uk-ua", "Ukrainian - Ukraine"))
            break;
        case "ur":
            localSchema.push(locale("ur-pk", "Urdu - Pakistan"))
            break;
        case "vi":
            localSchema.push(locale("vi-vn", "Vietnamese - Vietnam"))
            break;
        case "zh-hans":
            localSchema.push(locale("zh-chs", "Chinese (Simplified)"))
            break;
        case "zh-hant":
            localSchema.push(locale("zh-cht", "Chinese (Traditional)"))
            break;
        default:
            localSchema.push(locale("en-us", "English - United States"))
            break;
    }
    // return localSchema;

}

module.exports = { localeMapper };