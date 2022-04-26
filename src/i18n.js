import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// import Http from "i18next-http-backend";
// import BackendAdapter from 'i18next-multiload-backend-adapter';
import 'moment/locale/fr';
import translations_en from "./translations/en/translates";
import translations_fr from "./translations/fr/translates";
import Cookies from 'js-cookie';
import moment from "moment";
import { initReactI18next } from 'react-i18next'
import {LOCAL_LANGUAGE, SUPPORTED_LOCALES} from "./constants/constants";
// import { locale } from "devextreme/localization";

export const LANGUAGE_FR = "fr";
export const DEFAULT_LANGUAGE =  process.env.REACT_APP_DEFAULT_LOCALE;
const arrayLanguages = SUPPORTED_LOCALES
let cookieLanguage = Cookies.get(LOCAL_LANGUAGE) ?Cookies.get(LOCAL_LANGUAGE) : Cookies.get("i18nextLng") &&  arrayLanguages.includes(Cookies.get("i18nextLng")) ? Cookies.get("i18nextLng") :DEFAULT_LANGUAGE;

// moment.locale(cookieLanguage);
// locale(cookieLanguage)
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    // .use(BackendAdapter)
    .init({
        // debug: false,
        // // supportedLngs: ["en", "fr"],
        // lng: cookieLanguage,
        // fallbackLng: cookieLanguage,
        // interpolation: {
        //     escapeValue: false // not needed for react!!
        // },
        // // preload: ['en', 'fr'],
        // backend: {
        //     backend: Http,
        //     backendOption:{
        //         loadPath: `/api/translationmanager/list?langLocale={{lng}}`,
        //         // stringify: JSON.stringify,
        //         allowMultiLoading: true,
        //         // init option for fetch, for example
        //         requestOptions: {
        //             mode: 'cors',
        //             credentials: 'same-origin',
        //             cache: 'default',
        //         },
        //     }
        // },
        // load: 'languageOnly',
        // react: {
        //     wait: true,
        //     useSuspense: false
        // },


        supportedLngs:arrayLanguages,
        lng:cookieLanguage,
        fallbackLng: DEFAULT_LANGUAGE,
        debug: false,

        ns:["translations"],
        defaultNS: "translations",
        interpolation: {
            escapeValue: false // not needed for react!!
        },
        resources: {
            en: {
                translations: translations_en,
            },
            fr: {
                translations: translations_fr,
            }
        },
        react: {
            wait: false,
            useSuspense: false
        }
    }).then(r =>{
    // console.log(r)
});

export default i18n;
