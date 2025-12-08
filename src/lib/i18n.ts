
import type { Language } from '@/types';

const dictionary: Record<string, Record<Language, string>> = {
  // Header
  'bharat_heritage': {
    'en': 'Bharat Heritage',
    'hi': 'भारत विरासत',
    'kn': 'ಭಾರತ್ ಹೆರಿಟೇಜ್',
    'or': 'ଭାରତ ହେରିଟେଜ',
  },

  // Home Page
  'home_title': {
    'en': 'Bharat Heritage',
    'hi': 'भारत विरासत',
    'kn': 'ಭಾರತ್ ಹೆರಿಟೇಜ್',
    'or': 'ଭାରତ ହେରିଟେଜ',
  },
  'home_subtitle': {
    'en': "Step into the past. Explore India's magnificent cultural heritage in stunning augmented reality.",
    'hi': 'अतीत में कदम रखें। भारत की शानदार सांस्कृतिक विरासत को आश्चर्यजनक संवर्धित वास्तविकता में देखें।',
    'kn': 'ಹಿಂದಿನದಕ್ಕೆ ಹೆಜ್ಜೆ ಹಾಕಿ. ಭಾರತದ ಭವ್ಯವಾದ ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆಯನ್ನು ಬೆರಗುಗೊಳಿಸುವ ವರ್ಧಿತ ವಾಸ್ತವದಲ್ಲಿ ಅನ್ವೇಷಿಸಿ.',
    'or': 'ଅତୀତକୁ ପାଦ ଦିଅନ୍ତୁ। ଭାରତର ભવ્ય સાંસ્કૃતિક ଐତିହ୍ୟକୁ ଚମତ୍କାର ବର୍ଦ୍ଧିତ ବାସ୍ତବତାରେ ଅନୁଭବ କରନ୍ତୁ।',
  },
  'explore_sites': {
    'en': 'Explore Sites',
    'hi': 'स्थलों का अन्वेषण करें',
    'kn': 'ತಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    'or': 'ସ୍ଥାନଗୁଡିକ ଅନୁସନ୍ଧାନ କରନ୍ତୁ',
  },
  'discover_artifacts': {
    'en': 'Discover Artifacts',
    'hi': 'कलाकृतियों की खोज करें',
    'kn': 'ಕಲಾಕೃತಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    'or': 'କଳାକୃତି ଆବିଷ୍କାର କରନ୍ତୁ',
  },

  // Language Selector
  'choose_language_title': {
    'en': 'Choose your language',
    'hi': 'अपनी भाषा चुनें',
    'kn': 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'or': 'ଆପଣଙ୍କର ଭାଷା ଚୟନ କରନ୍ତୁ',
  },
  'choose_language_subtitle': {
    'en': 'This sets the app UI & narration language. You can change it later in Settings.',
    'hi': 'यह ऐप UI और वर्णन भाषा सेट करेगा। आप इसे बाद में सेटिंग में बदल सकते हैं।',
    'kn': 'ಇದು ಅಪ್ಲಿಕೇಶನ್ UI ಮತ್ತು ವಾಚನ ಭಾಷೆಯನ್ನು ಸೆಟ್ ಮಾಡುತ್ತದೆ. ನೀವು ಇದನ್ನು ನಂತರ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಬದಲಾಯಿಸಬಹುದು.',
    'or': 'ଏହା ଆପ୍ ପରିଚୟପଟ ଏବଂ ବାଣୀ ଭାଷା ସେଟ୍ କରିବ । ଆପଣ ପରେ ସେଟିଙ୍ଗ୍‌ରୁ ବଦଳାଇପାରିବେ ।',
  },
  'skip_use_english': {
    'en': 'Use English',
    'hi': 'English उपयोग करें',
    'kn': 'English ಬಳಸು',
    'or': 'ଇଂରାଜୀ ବ୍ୟବହାର କରନ୍ତୁ',
  },

  // Explore Pages
  'explore_heritage_sites': {
    'en': 'Explore Heritage Sites',
    'hi': 'विरासत स्थलों का अन्वेषण करें',
    'kn': 'ಪರಂಪರೆಯ ತಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    'or': 'ଐତିହ୍ୟ ସ୍ଥଳୀ ଅନୁସନ୍ଧାନ କରନ୍ତୁ',
  },
  'discover_magnificent_sites': {
    'en': 'Discover the magnificent historical sites of India.',
    'hi': 'भारत के शानदार ऐतिहासिक स्थलों की खोज करें।',
    'kn': 'ಭಾರತದ ಭವ್ಯವಾದ ಐತಿಹಾಸಿಕ ತಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.',
    'or': 'ଭାରତର ભવ્ય ଐତିହାସିକ ସ୍ଥାନ ଆବିଷ୍କାର କରନ୍ତୁ।',
  },
  'explore_historical_artifacts': {
    'en': 'Explore Historical Artifacts',
    'hi': 'ऐतिहासिक कलाकृतियों का अन्वेषण करें',
    'kn': 'ಐತಿಹಾಸಿಕ ಕಲಾಕೃತಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    'or': 'ଐତିହାସିକ କଳାକୃତି ଅନୁସନ୍ଧାନ କରନ୍ତୁ',
  },
  'journey_through_time': {
    'en': "Journey through time with these unique objects from India's past.",
    'hi': 'भारत के अतीत की इन अनूठी वस्तुओं के साथ समय के माध्यम से यात्रा करें।',
    'kn': 'ಭಾರತದ ಗತಕಾಲದ ಈ ಅನನ್ಯ ವಸ್ತುಗಳೊಂದಿಗೆ ಕಾಲಯಾನ ಮಾಡಿ.',
    'or': 'ଭାରତର ଅତୀତର ଏହି ଅନନ୍ୟ ବସ୍ତୁଗୁଡ଼ିକ ସହିତ ସମୟ ମାଧ୍ୟମରେ ଯାତ୍ରା କରନ୍ତୁ।',
  },

  // Lost India Page
  'lost_india_title': {
    'en': 'Lost India: Explore the Unseen',
    'hi': 'खोया भारत: अनदेखे को देखें',
    'kn': 'ಕಳೆದುಹೋದ ಭಾರತ: ಕಾಣದನ್ನು ಅನ್ವೇಷಿಸಿ',
    'or': 'ହଜିଲା ଭାରତ: ଅଦୃଶ୍ୟକୁ ଅନୁସନ୍ଧାନ କରନ୍ତୁ',
  },
  'lost_india_description': {
    'en': 'Discover endangered sites, forgotten history, and the myths surrounding them.',
    'hi': 'संकटग्रस्त स्थलों, भूले हुए इतिहास और उनसे जुड़े मिथकों की खोज करें।',
    'kn': 'ಅಪಾಯದಲ್ಲಿರುವ ತಾಣಗಳು, ಮರೆತುಹೋದ ಇತಿಹಾಸ ಮತ್ತು ಅವುಗಳನ್ನು ಸುತ್ತುವರಿದಿರುವ ಪುರಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.',
    'or': 'ବିପଦଗ୍ରସ୍ତ ସ୍ଥାନ, ଭୁଲିଯାଇଥିବା ଇତିହାସ, ଏବଂ ସେଗୁଡ଼ିକର ପୌରାଣିକ କାହାଣୀ ଆବିଷ୍କାର କରନ୍ତୁ।',
  },

  // Buttons
  'back_to_home': {
    'en': 'Back to Home',
    'hi': 'होम पर वापस जाएं',
    'kn': 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    'or': 'ହୋମକୁ ଫେରିଯାଆନ୍ତୁ',
  },
  'details': {
    'en': 'Details',
    'hi': 'विवरण',
    'kn': 'ವಿವರಗಳು',
    'or': 'ବିବରଣୀ',
  },
  'launch_ar': {
    'en': 'Launch AR',
    'hi': 'एआर लॉन्च करें',
    'kn': 'ಎಆರ್ ಪ್ರಾರಂಭಿಸಿ',
    'or': 'AR ଆରମ୍ଭ କରନ୍ତୁ',
  },
  'back_to_all_sites': {
    'en': 'Back to All Sites',
    'hi': 'सभी स्थलों पर वापस जाएं',
    'kn': 'ಎಲ್ಲಾ ತಾಣಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
    'or': 'ସମସ୍ତ ସାଇଟକୁ ଫେରନ୍ତୁ',
  },
  'back_to_all_artifacts': {
    'en': 'Back to All Artifacts',
    'hi': 'सभी कलाकृतियों पर वापस जाएं',
    'kn': 'ಎಲ್ಲಾ ಕಲಾಕೃತಿಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
    'or': 'ସମସ୍ତ କଳାକୃତିକୁ ଫେରନ୍ତୁ',
  },
  'show_3d_model': {
    'en': 'Show 3D Model',
    'hi': '3D मॉडल दिखाएं',
    'kn': '3ಡಿ ಮಾದರಿಯನ್ನು ತೋರಿಸಿ',
    'or': '3D ମଡେଲ ଦେଖାନ୍ତୁ',
  },
  'show_details': {
    'en': 'Show Details',
    'hi': 'विवरण दिखाएं',
    'kn': 'ವಿವರಗಳನ್ನು ತೋರಿಸಿ',
    'or': 'ବିବରଣୀ ଦେଖାନ୍ତୁ',
  },

  // Detail Pages
  'related_artifacts': {
    'en': 'Related Artifacts',
    'hi': 'संबंधित कलाकृतियाँ',
    'kn': 'ಸಂಬಂಧಿತ ಕಲಾಕೃತಿಗಳು',
    'or': 'ସମ୍ବନ୍ଧିତ କଳାକୃତି',
  },
  'read_description_aloud': {
    'en': 'Read Aloud',
    'hi': 'जोर से पढ़ें',
    'kn': 'ಗಟ್ಟಿಯಾಗಿ ಓದಿ',
    'or': 'ଜୋରରେ ପଢନ୍ତୁ',
  },

  // Panels
  'accessibility': {
    'en': 'Accessibility',
    'hi': 'सरल उपयोग',
    'kn': 'ಪ್ರವೇಶಿಸುವಿಕೆ',
    'or': 'ସୁଗମତା',
  },
  'customize_experience': {
    'en': 'Customize your experience for your needs.',
    'hi': ' अपनी आवश्यकताओं के लिए अपने अनुभव को अनुकूलित करें।',
    'kn': 'ನಿಮ್ಮ ಅಗತ್ಯಗಳಿಗಾಗಿ ನಿಮ್ಮ ಅನುಭವವನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ.',
    'or': 'ଆପଣଙ୍କ ଆବଶ୍ୟକତା ପାଇଁ ଆପଣଙ୍କ ଅନୁଭୂତିକୁ କଷ୍ଟମାଇଜ୍ କରନ୍ତୁ।',
  },
  'audio_narration': {
    'en': 'Audio Narration',
    'hi': 'ऑडियो',
    'kn': 'ಆಡಿಯೋ',
    'or': 'ଅଡିଓ',
  },
  'font_size': {
    'en': 'Font Size',
    'hi': 'फ़ॉन्ट आकार',
    'kn': 'ಅಕ್ಷರ ಗಾತ್ರ',
    'or': 'ଫଣ୍ଟ ଆକାର',
  },
  'high_contrast': {
    'en': 'High Contrast',
    'hi': 'उच्च कंट्रास्ट',
    'kn': 'ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್',
    'or': 'ଉଚ୍ଚ କଣ୍ଟ୍ରାଷ୍ଟ',
  },
  'theme': {
    'en': 'Theme',
    'hi': 'थीम',
    'kn': 'ಥೀಮ್',
    'or': 'ଥିମ୍',
  },
  'reset': {
    'en': 'Reset',
    'hi': 'रीसेट',
    'kn': 'ಮರುಹೊಂದಿಸಿ',
    'or': 'ରିସେଟ୍',
  },
  'settings': {
    'en': 'Settings',
    'hi': 'सेटिंग्स',
    'kn': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    'or': 'ସେଟିଂସମୂହ',
  },
  'adjust_preferences': {
    'en': 'Adjust your app preferences.',
    'hi': 'अपनी ऐप प्राथमिकताएं समायोजित करें।',
    'kn': 'ನಿಮ್ಮ ಅಪ್ಲಿಕೇಶನ್ ಪ್ರಾಶಸ್ತ್ಯಗಳನ್ನು ಹೊಂದಿಸಿ.',
    'or': 'ଆପଣଙ୍କ ଆପ୍ ପସନ୍ଦଗୁଡ଼ିକୁ ସଜାଡ଼ନ୍ତୁ।',
  },
  'low_bandwidth_mode': {
    'en': 'Low Bandwidth Mode',
    'hi': 'कम बैंडविड्थ मोड',
    'kn': 'ಕಡಿಮೆ ಬ್ಯಾಂಡ್‌ವಿಡ್ತ್ ಮೋಡ್',
    'or': 'କମ୍ ବ୍ୟାଣ୍ଡୱିଡ୍ ମୋଡ୍',
  },
  'language': {
    'en': 'Language',
    'hi': 'भाषा',
    'kn': 'ಭಾಷೆ',
    'or': 'ଭାଷା',
  },
  'select_language': {
    'en': 'Select language',
    'hi': 'भाषा चुनें',
    'kn': 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'or': 'ଭାଷା ବାଛନ୍ତୁ',
  },
  'select_theme': {
    'en': 'Select theme',
    'hi': 'थीम चुनें',
    'kn': 'ಥೀಮ್ ಆಯ್ಕೆಮಾಡಿ',
    'or': 'ଥିମ୍ ବାଛନ୍ତୁ',
  },
  'english': {
    'en': 'English',
    'hi': 'अंग्रेजी',
    'kn': 'ಆಂಗ್ಲ',
    'or': 'ଇଂରାଜୀ',
  },
  'hindi': {
    'en': 'Hindi',
    'hi': 'हिंदी',
    'kn': 'ಹಿಂದಿ',
    'or': 'ହିନ୍ଦୀ',
  },
  'kannada': {
    'en': 'Kannada',
    'hi': 'कन्नड़',
    'kn': 'ಕನ್ನಡ',
    'or': 'କନ୍ନଡ',
  },
  'odia': {
    'en': 'Odia',
    'hi': 'ओड़िया',
    'kn': 'ಒಡಿಯಾ',
    'or': 'ଓଡ଼ିଆ',
  },
  'bionic_reading': {
    'en': 'Bionic Reading',
    'hi': 'बायोनिक रीडिंग',
    'kn': 'ಬಯೋನಿಕ್ ರೀಡಿಂಗ್',
    'or': 'ବାୟୋନିକ ପଠନ',
  },
  'dyslexia_font': {
    'en': 'Dyslexia Font',
    'hi': 'डिस्लेक्सिया फॉन्ट',
    'kn': 'ಡಿಸ್ಲೆಕ್ಸಿಯಾ ಫಾಂಟ್',
    'or': 'ଡିସ୍ଲେକ୍ସିଆ ଫଣ୍ଟ',
  }
};

export const t = (key: string, lang: Language): string => {
  return dictionary[key]?.[lang] || dictionary[key]?.['en'] || key;
};
