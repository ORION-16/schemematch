const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const Scheme = require('../models/Scheme');

const schemes = [
  {
    id: 1,
    name: 'PM Kisan Samman Nidhi',
    category: 'Agriculture',
    benefit: '₹6,000 per year in 3 installments directly to farmer bank accounts.',
    documents: ['Aadhaar Card', 'Land Records / Khasra', 'Bank Account Passbook'],
    link: 'https://pmkisan.gov.in',
    linkType: 'URL',
    eligibility: { occupations: ['Farmer'], requiresLand: true },
    translations: {
      hi: {
        name: 'पीएम किसान सम्मान निधि',
        benefit: 'किसानों के बैंक खातों में सीधे 3 किश्तों में ₹6,000 प्रति वर्ष।'
      },
      mr: {
        name: 'पीएम किसान सन्मान निधी',
        benefit: 'शेतकऱ्यांच्या बँक खात्यात थेट ३ हप्त्यांमध्ये वर्षाला ₹६,०००.'
      }
    }
  },
  {
    id: 2,
    name: 'PM Fasal Bima Yojana',
    category: 'Agriculture',
    benefit: 'Crop insurance covering losses due to natural calamities, pests, and diseases.',
    documents: ['Aadhaar Card', 'Land Records', 'Bank Account'],
    link: 'https://pmfby.gov.in',
    linkType: 'URL',
    eligibility: { occupations: ['Farmer'] },
    translations: {
      hi: {
        name: 'पीएम फसल बीमा योजना',
        benefit: 'प्राकृतिक आपदाओं, कीटों और रोगों के कारण होने वाले नुकसान को कवर करने वाला फसल बीमा।'
      },
      mr: {
        name: 'पीएम पीक विमा योजना',
        benefit: 'नैसर्गिक आपत्ती, कीड आणि रोगांमुळे होणाऱ्या नुकसानीसाठी पीक विमा संरक्षण.'
      }
    }
  },
  {
    id: 3,
    name: 'Kisan Credit Card (KCC)',
    category: 'Agriculture',
    benefit: 'Short-term credit up to ₹3 lakh at subsidised interest rates for farming needs.',
    documents: ['Aadhaar Card', 'Land Proof', 'Passport Photo'],
    link: 'https://www.india.gov.in/spotlight/kisan-credit-card',
    linkType: 'URL',
    eligibility: { occupations: ['Farmer'], requiresLand: true },
    translations: {
      hi: {
        name: 'किसान क्रेडिट कार्ड (KCC)',
        benefit: 'खेती की जरूरतों के लिए रियायती ब्याज दरों पर ₹3 लाख तक का अल्पकालिक ऋण।'
      },
      mr: {
        name: 'किसान क्रेडिट कार्ड (KCC)',
        benefit: 'शेतीसाठी सवलतीच्या व्याजदरात ₹३ लाखांपर्यंतचे अल्पमुदत कर्ज.'
      }
    }
  },
  {
    id: 4,
    name: 'Ayushman Bharat PM-JAY',
    category: 'Health',
    benefit: 'Free health insurance up to ₹5 lakh per family per year for secondary & tertiary care.',
    documents: ['Aadhaar Card', 'Ration Card / BPL Certificate'],
    link: 'https://pmjay.gov.in',
    linkType: 'URL',
    eligibility: {
      maxIncome: 200000,
      customRule: "profile.income <= 200000 || profile.hasBPL === 'yes'",
    },
    translations: {
      hi: {
        name: 'आयुष्मान भारत पीएम-जेएवाई',
        benefit: 'माध्यमिक और तृतीयक देखभाल के लिए प्रति परिवार प्रति वर्ष ₹5 लाख तक का मुफ्त स्वास्थ्य बीमा।'
      },
      mr: {
        name: 'आयुष्मान भारत पीएम-जेएवाय',
        benefit: 'दुय्यम आणि तृतीयक काळजीसाठी प्रति कुटुंब प्रति वर्ष ₹५ लाखांपर्यंत मोफत आरोग्य विमा.'
      }
    }
  },
  {
    id: 5,
    name: 'PM Jan Dhan Yojana',
    category: 'Finance',
    benefit: 'Zero-balance bank account with RuPay card, ₹1 lakh accident insurance, ₹30,000 life cover.',
    documents: ['Aadhaar Card / Voter ID', 'Passport Photo'],
    link: 'https://pmjdy.gov.in',
    linkType: 'URL',
    eligibility: {},
    translations: {
      hi: {
        name: 'पीएम जन धन योजना',
        benefit: 'रुपे कार्ड के साथ शून्य-शेष बैंक खाता, ₹1 लाख दुर्घटना बीमा, ₹30,000 जीवन बीमा।'
      },
      mr: {
        name: 'पीएम जन धन योजना',
        benefit: 'रुपे कार्डसह शून्य-बॅलन्स बँक खाते, ₹१ लाख अपघात विमा, ₹३०,००० जीवन विमा.'
      }
    }
  },
  {
    id: 6,
    name: 'PM Awas Yojana – Gramin',
    category: 'Housing',
    benefit: 'Financial assistance of ₹1.2–1.3 lakh for construction of a pucca house in rural areas.',
    documents: ['Aadhaar Card', 'BPL Certificate', 'Bank Account'],
    link: 'https://pmayg.nic.in',
    linkType: 'URL',
    eligibility: { requiresNoHouse: true, maxIncome: 300000 },
    translations: {
      hi: {
        name: 'पीएम आवास योजना - ग्रामीण',
        benefit: 'ग्रामीण क्षेत्रों में पक्के घर के निर्माण के लिए ₹1.2–1.3 लाख की वित्तीय सहायता।'
      },
      mr: {
        name: 'पीएम आवास योजना - ग्रामीण',
        benefit: 'ग्रामीण भागात पक्के घर बांधण्यासाठी ₹१.२-१.३ लाखांची आर्थिक मदत.'
      }
    }
  },
  {
    id: 7,
    name: 'PM Awas Yojana – Urban',
    category: 'Housing',
    benefit: 'Interest subsidy of 3–6.5% on home loans for first-time buyers in urban areas.',
    documents: ['Aadhaar Card', 'Income Proof', 'Bank Statements'],
    link: 'https://pmaymis.gov.in',
    linkType: 'URL',
    eligibility: { requiresNoHouse: true, maxIncome: 600000 },
    translations: {
      hi: {
        name: 'पीएम आवास योजना - शहरी',
        benefit: 'शहरी क्षेत्रों में पहली बार घर खरीदने वालों के लिए गृह ऋण पर 3–6.5% की ब्याज सब्सिडी।'
      },
      mr: {
        name: 'पीएम आवास योजना - शहरी',
        benefit: 'शहरी भागातील प्रथमच घर खरेदी करणाऱ्यांसाठी गृहकर्जावर ३-६.५% व्याज सबसिडी.'
      }
    }
  },
  {
    id: 8,
    name: 'PM Ujjwala Yojana',
    category: 'Women',
    benefit: 'Free LPG connection with first refill and stove to women from BPL/low-income households.',
    documents: ['Aadhaar Card', 'BPL Ration Card', 'Bank Account'],
    link: 'https://www.pmuy.gov.in',
    linkType: 'URL',
    eligibility: {
      requiredGender: 'Female',
      customRule: "profile.gender==='Female' && (profile.hasBPL==='yes' || profile.income<=100000)",
    },
    translations: {
      hi: {
        name: 'पीएम उज्वला योजना',
        benefit: 'बीपीएल/कम आय वाले परिवारों की महिलाओं को पहली रिफिल और चूल्हे के साथ मुफ्त एलपीजी कनेक्शन।'
      },
      mr: {
        name: 'पीएम उज्ज्वला योजना',
        benefit: 'दारिद्र्यरेषेखालील/कमी उत्पन्न असलेल्या कुटुंबातील महिलांना मोफत एलपीजी कनेक्शन, पहिला रिफिल आणि शेगडीसह.'
      }
    }
  },
  {
    id: 9,
    name: 'Sukanya Samriddhi Yojana',
    category: 'Women',
    benefit: 'High-interest savings scheme at 8.2% p.a. for girl child — fully tax-exempt.',
    documents: ["Girl Child's Birth Certificate", 'Aadhaar Card', "Parent's ID"],
    link: 'https://www.india.gov.in/sukanya-samriddhi-account',
    linkType: 'URL',
    eligibility: { requiresGirlChild: true },
    translations: {
      hi: {
        name: 'सुकन्या समृद्धि योजना',
        benefit: 'बालिकाओं के लिए 8.2% प्रति वर्ष की उच्च-ब्याज वाली बचत योजना - पूरी तरह से कर-मुक्त।'
      },
      mr: {
        name: 'सुकन्या समृद्धी योजना',
        benefit: 'मुलींसाठी वर्षाला ८.२% दराची उच्च-व्याज बचत योजना - पूर्णपणे करमुक्त.'
      }
    }
  },
  {
    id: 10,
    name: 'PM Matru Vandana Yojana',
    category: 'Women',
    benefit: '₹5,000 cash incentive in 3 installments for pregnant and lactating mothers.',
    documents: ['Aadhaar Card', 'MCP Card (Antenatal)', 'Bank Account'],
    link: 'https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana',
    linkType: 'URL',
    eligibility: { requiredGender: 'Female', requiresPregnant: true },
    translations: {
      hi: {
        name: 'पीएम मातृ वंदना योजना',
        benefit: 'गर्भवती और स्तनपान कराने वाली माताओं के लिए 3 किश्तों में ₹5,000 नकद प्रोत्साहन।'
      },
      mr: {
        name: 'पीएम मातृ वंदना योजना',
        benefit: 'गर्भवती आणि स्तनपान देणाऱ्या मातांसाठी ३ हप्त्यांमध्ये ₹५,००० रोख प्रोत्साहन.'
      }
    }
  },
  {
    id: 11,
    name: 'Pradhan Mantri Mudra Yojana',
    category: 'Finance',
    benefit: 'Collateral-free loans up to ₹10 lakh for small & micro enterprises.',
    documents: ['Aadhaar Card', 'Business Plan', 'Bank Account'],
    link: 'https://www.mudra.org.in',
    linkType: 'URL',
    eligibility: { occupations: ['Self-employed', 'Unemployed'] },
  },
  {
    id: 12,
    name: 'PM Kaushal Vikas Yojana (PMKVY)',
    category: 'Employment',
    benefit: 'Free skill training in 300+ job roles with government-recognised certification.',
    documents: ['Aadhaar Card', 'Educational Certificates', 'Bank Account'],
    link: 'https://www.pmkvyofficial.org',
    linkType: 'URL',
    eligibility: { occupations: ['Unemployed'], minAge: 15, maxAge: 45 },
  },
  {
    id: 13,
    name: 'National Scholarship Portal',
    category: 'Education',
    benefit: 'Scholarships from ₹1,000–25,000/year for pre-matric and post-matric students.',
    documents: ['Aadhaar Card', 'Income Certificate', 'Previous Year Marksheet'],
    link: 'https://scholarships.gov.in',
    linkType: 'URL',
    deadline: 'August–November annually',
    eligibility: { occupations: ['Student'], maxIncome: 250000 },
  },
  {
    id: 14,
    name: 'Post-Matric Scholarship SC/ST',
    category: 'Education',
    benefit: 'Full tuition + maintenance allowance for SC/ST students in post-matric education.',
    documents: ['Aadhaar Card', 'Caste Certificate', 'Income Certificate', 'Marksheet'],
    link: 'https://scholarships.gov.in',
    linkType: 'URL',
    eligibility: { occupations: ['Student'], categories: ['SC', 'ST'] },
  },
  {
    id: 15,
    name: 'Stand Up India',
    category: 'Finance',
    benefit: 'Bank loans ₹10 lakh–₹1 crore for SC/ST and women entrepreneurs.',
    documents: ['Aadhaar Card', 'Business Plan', 'Caste Certificate (if applicable)'],
    link: 'https://www.standupmitra.in',
    linkType: 'URL',
    eligibility: {
      customRule:
        "(profile.category==='SC'||profile.category==='ST'||profile.gender==='Female') && profile.occupation==='Self-employed'",
    },
  },
  {
    id: 16,
    name: 'MGNREGA',
    category: 'Employment',
    benefit: 'Guaranteed 100 days of wage employment per year for rural households.',
    documents: ['Aadhaar Card', 'Bank Account'],
    linkType: 'OFFLINE',
    offlineGuidance: {
      whereTo: 'Your nearest Gram Panchayat office',
      whatToBring: 'Aadhaar Card, Bank Account Passbook, Passport Photo',
      whatToSay: 'I want to register for a MGNREGA Job Card under my name',
      helpline: '1800-111-555',
    },
    eligibility: {
      maxIncome: 150000,
      occupations: ['Farmer', 'Unemployed', 'Daily Wage Worker'],
    },
  },
  {
    id: 17,
    name: 'PM Vaya Vandana Yojana',
    category: 'Senior',
    benefit: 'Guaranteed pension at 7.4% p.a. for 10 years. Invest up to ₹15 lakh.',
    documents: ['Aadhaar Card', 'Age Proof', 'Bank Account'],
    link: 'https://www.licindia.in/Products/Pension-Plans/Pradhan-Mantri-Vaya-Vandana-Yojana',
    linkType: 'URL',
    eligibility: { minAge: 60 },
  },
  {
    id: 18,
    name: 'Indira Gandhi National Old Age Pension',
    category: 'Senior',
    benefit: 'Monthly pension of ₹200–500 for destitute BPL senior citizens aged 60+.',
    documents: ['Aadhaar Card', 'Age Proof', 'BPL Certificate'],
    linkType: 'OFFLINE',
    offlineGuidance: {
      whereTo: 'District Social Welfare Office in your district',
      whatToBring:
        'Aadhaar Card, Age Proof (birth cert/school cert), BPL Ration Card, 2 passport photos, Bank Passbook',
      whatToSay:
        'I want to apply for the Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
      helpline: '14567',
    },
    eligibility: {
      minAge: 60,
      customRule: "profile.age>=60 && (profile.hasBPL==='yes' || profile.income<=100000)",
    },
  },
  {
    id: 19,
    name: 'Beti Bachao Beti Padhao',
    category: 'Women',
    benefit: "Financial incentives and scholarship support for girl children's education.",
    documents: ['Birth Certificate', 'Aadhaar Card', 'School Enrollment Proof'],
    link: 'https://wcd.nic.in/bbbp-schemes',
    linkType: 'URL',
    eligibility: { requiresGirlChild: true },
  },
  {
    id: 20,
    name: 'PM Garib Kalyan Anna Yojana',
    category: 'Finance',
    benefit: '5 kg free food grains per person per month for ration card holders.',
    documents: ['Ration Card', 'Aadhaar Card'],
    linkType: 'OFFLINE',
    offlineGuidance: {
      whereTo: 'Your nearest Fair Price Shop (Ration Shop)',
      whatToBring: 'Ration Card, Aadhaar Card',
      whatToSay: 'I want to claim my free food grains under PMGKAY',
      helpline: '1967',
    },
    eligibility: {
      customRule: "profile.hasBPL==='yes' || profile.income<=100000",
    },
  },
  {
    id: 21,
    name: 'PM Jeevan Jyoti Bima Yojana',
    category: 'Finance',
    benefit: 'Life insurance cover of ₹2 lakh at just ₹330/year premium.',
    documents: ['Aadhaar Card', 'Bank Account with auto-debit consent'],
    link: 'https://jansuraksha.gov.in',
    linkType: 'URL',
    deadline: 'Annual renewal',
    eligibility: { minAge: 18, maxAge: 50 },
  },
  {
    id: 22,
    name: 'PM Suraksha Bima Yojana',
    category: 'Finance',
    benefit: 'Accident insurance cover of ₹2 lakh for death/disability at ₹20/year.',
    documents: ['Aadhaar-linked Bank Account'],
    link: 'https://jansuraksha.gov.in',
    linkType: 'URL',
    deadline: 'Annual renewal',
    eligibility: { minAge: 18, maxAge: 70 },
  },
  {
    id: 23,
    name: 'e-Shram Portal Registration',
    category: 'Employment',
    benefit: 'UAN card for unorganised workers + ₹2 lakh accident insurance + scheme access.',
    documents: ['Aadhaar Card', 'Bank Account', 'Mobile Number'],
    link: 'https://eshram.gov.in',
    linkType: 'URL',
    eligibility: { occupations: ['Daily Wage Worker', 'Farmer', 'Self-employed'] },
  },
  {
    id: 24,
    name: 'Atal Pension Yojana',
    category: 'Finance',
    benefit: 'Guaranteed monthly pension of ₹1,000–5,000 after age 60. Premium varies by age.',
    documents: ['Aadhaar Card', 'Bank Account', 'Mobile Number'],
    link: 'https://npscra.nsdl.co.in/scheme-details.php',
    linkType: 'URL',
    eligibility: { minAge: 18, maxAge: 40, maxIncome: 300000 },
  },
  {
    id: 25,
    name: 'PM SVANidhi',
    category: 'Finance',
    benefit: 'Collateral-free working capital loans of ₹10,000–₹50,000 for street vendors.',
    documents: ['Aadhaar Card', 'Vending Certificate / Surveyed Vendor Letter', 'Bank Account'],
    link: 'https://pmsvanidhi.mohua.gov.in',
    linkType: 'URL',
    eligibility: {
      customRule: "profile.occupation==='Self-employed' && profile.income<=150000",
    },
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Scheme.deleteMany({});
    console.log('Cleared existing schemes.');

    await Scheme.insertMany(schemes);
    console.log(`Seeded ${schemes.length} schemes successfully.`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
}

// Export for auto-seeding in server.js
module.exports = { schemes, seed };

if (require.main === module) {
  seed();
}
