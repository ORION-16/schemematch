import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        tagline: "Your Guide to Government Welfare",
        home: "Home",
        changeLanguage: "Change Language"
      },
      landing: {
        title1: "Find Government Schemes You ",
        title2: "Qualify For",
        subtitle: "Answer a few simple questions to discover state and central welfare schemes tailored for your profile. Fast, free, and secure.",
        cta: "Find My Schemes Now",
        stats_schemes: "Schemes",
        stats_categories: "Categories",
        stats_time: "Quiz"
      },
      quiz: {
        step: "Step {{step}} of {{total}}",
        back: "Back",
        continue: "Continue",
        find: "Find My Schemes",
        basicInfo: "Basic Information",
        genderTitle: "What is your gender?",
        genderOptions: {
          Male: "Male",
          Female: "Female",
          Other: "Other"
        },
        ageTitle: "What is your age?",
        ageText: "{{age}} Years old",
        socioInfo: "Socio-Economic Profile",
        categoryTitle: "Which category do you belong to?",
        incomeTitle: "What is your annual family income?",
        incomeText: "₹{{income}} Lakhs",
        occInfo: "Occupation Details",
        occTitle: "What is your primary occupation?",
        occOptions: {
          Student: "Student",
          Farmer: "Farmer",
          Unemployed: "Unemployed",
          Employed: "Employed",
          Business: "Business",
          Homemaker: "Homemaker"
        },
        addInfo: "Additional Criteria",
        bplTitle: "Do you hold a BPL (Below Poverty Line) card?",
        disabledTitle: "Are you a person with disabilities (PWD)?",
        minorityTitle: "Do you belong to a minority community?",
        yes: "Yes",
        no: "No",
        locInfo: "Location",
        locTitle: "Which state do you reside in?",
        isPregnantTitle: "Are you currently pregnant?"
      },
      results: {
        title1: "We found ",
        title2: " schemes for you",
        subtitle: "Based on your profile, you are eligible for the following benefits.",
        retake: "Retake Quiz",
        allCategories: "All",
        noResults: "No results found",
        returnHome: "Return Home",
        viewDetails: "View Details & Apply",
        printList: "Print List"
      },
      panel: {
        appDetails: "Application Details",
        benDetails: "Benefits Breakdown",
        eligibility: "Eligibility Recap",
        howToApply: "How to Apply",
        onlineBtn: "Apply Online via Official Portal",
        onlineText: "You can apply for this scheme directly through the official portal.",
        offlineTitle: "Offline Application",
        whereTo: "Where to go",
        whatToSay: "What to say",
        helpline: "Helpline",
        reqDocs: "Required Documents",
        noDocs: "No specific documents listed.",
        close: "Close"
      }
    }
  },
  hi: {
    translation: {
      nav: {
        tagline: "सरकारी कल्याणकारी योजनाओं के लिए आपका गाइड",
        home: "होम",
        changeLanguage: "भाषा बदलें"
      },
      landing: {
        title1: "सरकारी योजनाएं खोजें जिनके लिए आप ",
        title2: "पात्र हैं",
        subtitle: "अपनी प्रोफ़ाइल के अनुसार राज्य और केंद्रीय कल्याण योजनाओं को खोजने के लिए कुछ सरल प्रश्नों के उत्तर दें। तेज़, मुफ़्त और सुरक्षित।",
        cta: "अभी मेरी योजनाएं खोजें",
        stats_schemes: "योजनाएं",
        stats_categories: "श्रेणियां",
        stats_time: "प्रश्नोत्तरी"
      },
      quiz: {
        step: "चरण {{step}} / {{total}}",
        back: "पीछे",
        continue: "जारी रखें",
        find: "मेरी योजनाएं खोजें",
        basicInfo: "मूल जानकारी",
        genderTitle: "आपका लिंग क्या है?",
        genderOptions: {
          Male: "पुरुष",
          Female: "महिला",
          Other: "अन्य"
        },
        ageTitle: "आपकी आयु क्या है?",
        ageText: "{{age}} वर्ष",
        socioInfo: "सामाजिक-आर्थिक प्रोफ़ाइल",
        categoryTitle: "आप किस श्रेणी से संबंधित हैं?",
        incomeTitle: "आपकी वार्षिक पारिवारिक आय क्या है?",
        incomeText: "₹{{income}} लाख",
        occInfo: "व्यवसाय विवरण",
        occTitle: "आपका मुख्य व्यवसाय क्या है?",
        occOptions: {
          Student: "छात्र",
          Farmer: "किसान",
          Unemployed: "बेरोजगार",
          Employed: "नौकरीपेशा",
          Business: "व्यवसाय",
          Homemaker: "गृहिणी"
        },
        addInfo: "अतिरिक्त मानदंड",
        bplTitle: "क्या आपके पास बीपीएल (गरीबी रेखा से नीचे) कार्ड है?",
        disabledTitle: "क्या आप विकलांग व्यक्ति (PWD) हैं?",
        minorityTitle: "क्या आप अल्पसंख्यक समुदाय से संबंधित हैं?",
        yes: "हाँ",
        no: "नहीं",
        locInfo: "स्थान",
        locTitle: "आप किस राज्य में रहते हैं?",
        isPregnantTitle: "क्या आप वर्तमान में गर्भवती हैं?"
      },
      results: {
        title1: "हमें आपके लिए ",
        title2: " योजनाएं मिली हैं",
        subtitle: "आपकी प्रोफ़ाइल के आधार पर, आप निम्नलिखित लाभों के पात्र हैं।",
        retake: "फिर से प्रश्नोत्तरी लें",
        allCategories: "सभी",
        noResults: "कोई परिणाम नहीं मिला",
        returnHome: "होम पर लौटें",
        viewDetails: "विवरण देखें और आवेदन करें",
        printList: "सूची प्रिंट करें"
      },
      panel: {
        appDetails: "आवेदन विवरण",
        benDetails: "लाभ विवरण",
        eligibility: "पात्रता पुनर्कथन",
        howToApply: "आवेदन कैसे करें",
        onlineBtn: "आधिकारिक पोर्टल के माध्यम से ऑनलाइन आवेदन करें",
        onlineText: "आप इस योजना के लिए सीधे आधिकारिक पोर्टल के माध्यम से आवेदन कर सकते हैं।",
        offlineTitle: "ऑफ़लाइन आवेदन",
        whereTo: "कहाँ जाना है",
        whatToSay: "क्या कहना है",
        helpline: "हेल्पलाइन",
        reqDocs: "आवश्यक दस्तावेज़",
        noDocs: "कोई विशिष्ट दस्तावेज़ सूचीबद्ध नहीं हैं।",
        close: "बंद करें"
      }
    }
  },
  mr: {
    translation: {
      nav: {
        tagline: "सरकारी कल्याणकारी योजनांसाठी तुमचे मार्गदर्शक",
        home: "मुख्यपृष्ठ",
        changeLanguage: "भाषा बदला"
      },
      landing: {
        title1: "सरकारी योजना शोधा ज्यासाठी तुम्ही ",
        title2: "पात्र आहात",
        subtitle: "तुमच्या प्रोफाईलनुसार राज्य आणि केंद्रीय कल्याणकारी योजना शोधण्यासाठी काही सोप्या प्रश्नांची उत्तरे द्या. जलद, विनामूल्य आणि सुरक्षित.",
        cta: "माझ्या योजना आता शोधा",
        stats_schemes: "योजना",
        stats_categories: "श्रेण्या",
        stats_time: "प्रश्नमंजुषा"
      },
      quiz: {
        step: "पाऊल {{step}} / {{total}}",
        back: "मागे",
        continue: "पुढे जा",
        find: "माझ्या योजना शोधा",
        basicInfo: "मूलभूत माहिती",
        genderTitle: "तुमचे लिंग काय आहे?",
        genderOptions: {
          Male: "पुरुष",
          Female: "स्त्री",
          Other: "इतर"
        },
        ageTitle: "तुमचे वय किती आहे?",
        ageText: "{{age}} वर्षे",
        socioInfo: "सामाजिक-आर्थिक प्रोफाइल",
        categoryTitle: "तुम्ही कोणत्या श्रेणीतील आहात?",
        incomeTitle: "तुमचे वार्षिक कौटुंबिक उत्पन्न किती आहे?",
        incomeText: "₹{{income}} लाख",
        occInfo: "व्यवसाय तपशील",
        occTitle: "तुमचा मुख्य व्यवसाय कोणता आहे?",
        occOptions: {
          Student: "विद्यार्थी",
          Farmer: "शेतकरी",
          Unemployed: "बेरोजगार",
          Employed: "नोकरदार",
          Business: "व्यवसाय",
          Homemaker: "गृहिणी"
        },
        addInfo: "अतिरिक्त निकष",
        bplTitle: "तुमच्याकडे बीपीएल (दारिद्र्य रेषेखालील) कार्ड आहे का?",
        disabledTitle: "तुम्ही दिव्यांग (PWD) व्यक्ती आहात का?",
        minorityTitle: "तुम्ही अल्पसंख्याक समाजातील आहात का?",
        yes: "होय",
        no: "नाही",
        locInfo: "स्थान",
        locTitle: "तुम्ही कोणत्या राज्यात राहता?",
        isPregnantTitle: "तुम्ही सध्या गर्भवती आहात का?"
      },
      results: {
        title1: "आम्हाला तुमच्यासाठी ",
        title2: " योजना सापडल्या",
        subtitle: "तुमच्या प्रोफाईलच्या आधारावर, तुम्ही खालील फायद्यांसाठी पात्र आहात.",
        retake: "पुन्हा प्रश्नमंजुषा सोडवा",
        allCategories: "सर्व",
        noResults: "कोणतेही परिणाम आढळले नाहीत",
        returnHome: "मुख्यपृष्ठावर परत या",
        viewDetails: "तपशील पहा आणि अर्ज करा",
        printList: "यादी मुद्रित करा"
      },
      panel: {
        appDetails: "अर्ज तपशील",
        benDetails: "फायद्यांचे वर्गीकरण",
        eligibility: "पात्रतेचा सारांश",
        howToApply: "अर्ज कसा करावा",
        onlineBtn: "अधिकृत पोर्टलवरून ऑनलाइन अर्ज करा",
        onlineText: "तुम्ही या योजनेसाठी थेट अधिकृत पोर्टलद्वारे अर्ज करू शकता.",
        offlineTitle: "ऑफलाइन अर्ज",
        whereTo: "कुठे जावे",
        whatToSay: "काय बोलावे",
        helpline: "हेल्पलाईन",
        reqDocs: "आवश्यक कागदपत्रे",
        noDocs: "कोणतीही विशिष्ट कागदपत्रे सूचीबद्ध नाहीत.",
        close: "बंद करा"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from xss
    }
  });

export default i18n;
