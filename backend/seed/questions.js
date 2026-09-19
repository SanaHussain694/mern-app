// backend/seed/questions.js
const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const questions = [

  // ═══════════════════════════════════════
  // WEB DEV — MCQ (20 questions)
  // ═══════════════════════════════════════
  { domain: 'web-dev', type: 'MCQ', difficulty: 'easy',
    question: 'HTML ka full form kya hai?',
    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
    correctAnswer: 'Hyper Text Markup Language' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'easy',
    question: 'CSS mein `display: flex` kya karta hai?',
    options: ['Block layout banata hai', 'Flexbox layout enable karta hai', 'Element hide karta hai', 'Grid layout banata hai'],
    correctAnswer: 'Flexbox layout enable karta hai' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'easy',
    question: 'JavaScript mein array ka pehla element kaise access karte hain?',
    options: ['arr[1]', 'arr[0]', 'arr.first()', 'arr.get(0)'],
    correctAnswer: 'arr[0]' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'medium',
    question: 'React mein `useState` hook ka kya kaam hai?',
    options: ['API call karna', 'Component mein state manage karna', 'Route change karna', 'CSS lagana'],
    correctAnswer: 'Component mein state manage karna' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'medium',
    question: 'HTTP status code 404 ka matlab kya hai?',
    options: ['Server Error', 'Unauthorized', 'Not Found', 'Success'],
    correctAnswer: 'Not Found' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'medium',
    question: 'REST API mein data create karne ke liye kaunsa method use hota hai?',
    options: ['GET', 'DELETE', 'POST', 'PUT'],
    correctAnswer: 'POST' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'medium',
    question: 'Node.js kya hai?',
    options: ['Browser', 'JavaScript runtime environment', 'Database', 'CSS framework'],
    correctAnswer: 'JavaScript runtime environment' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'medium',
    question: 'MongoDB mein data kis format mein store hota hai?',
    options: ['Tables', 'XML', 'BSON/JSON documents', 'CSV'],
    correctAnswer: 'BSON/JSON documents' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'hard',
    question: 'React mein `useEffect` ka dependency array `[]` kya represent karta hai?',
    options: ['Har render pe chalega', 'Sirf mount pe chalega', 'Kabhi nahi chalegea', 'Unmount pe chalega'],
    correctAnswer: 'Sirf mount pe chalega' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'hard',
    question: 'JWT token mein kitne parts hote hain?',
    options: ['1', '2', '3', '4'],
    correctAnswer: '3' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'easy',
    question: '`npm install` command kya karta hai?',
    options: ['Node uninstall karta hai', 'package.json ki dependencies install karta hai', 'Server start karta hai', 'Code compile karta hai'],
    correctAnswer: 'package.json ki dependencies install karta hai' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'medium',
    question: 'CSS `position: absolute` kaise kaam karta hai?',
    options: ['Normal flow mein rehta hai', 'Nearest positioned parent ke relative hota hai', 'Window ke relative hota hai', 'Document ke top pe fix hota hai'],
    correctAnswer: 'Nearest positioned parent ke relative hota hai' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'medium',
    question: 'Async/Await JavaScript mein kya karta hai?',
    options: ['Code fast karta hai', 'Asynchronous code ko synchronous style mein likhne deta hai', 'Loop chalaata hai', 'Error handle karta hai'],
    correctAnswer: 'Asynchronous code ko synchronous style mein likhne deta hai' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'hard',
    question: 'CORS error kab aata hai?',
    options: ['Wrong password', 'Different origin se request aaye aur server allow na kare', 'Database disconnect', 'File not found'],
    correctAnswer: 'Different origin se request aaye aur server allow na kare' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'easy',
    question: 'HTML mein `<a>` tag kya karta hai?',
    options: ['Image dikhata hai', 'Link banata hai', 'Table banata hai', 'Form banata hai'],
    correctAnswer: 'Link banata hai' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'medium',
    question: 'Express.js mein middleware kya hota hai?',
    options: ['Database', 'Request aur response ke beech mein chalne wala function', 'HTML template', 'CSS file'],
    correctAnswer: 'Request aur response ke beech mein chalne wala function' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'hard',
    question: 'React mein `key` prop kyun zaroori hai list rendering mein?',
    options: ['Styling ke liye', 'Har element ko uniquely identify karne ke liye', 'Event handling ke liye', 'API call ke liye'],
    correctAnswer: 'Har element ko uniquely identify karne ke liye' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'medium',
    question: 'LocalStorage aur SessionStorage mein kya farq hai?',
    options: ['Koi farq nahi', 'LocalStorage browser band hone ke baad bhi rehta hai', 'SessionStorage bada hota hai', 'LocalStorage sirf login ke liye hai'],
    correctAnswer: 'LocalStorage browser band hone ke baad bhi rehta hai' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'hard',
    question: 'MongoDB mein `$lookup` kya karta hai?',
    options: ['Document dhundhta hai', 'Collections ko join karta hai', 'Data delete karta hai', 'Index banata hai'],
    correctAnswer: 'Collections ko join karta hai' },

  { domain: 'web-dev', type: 'MCQ', difficulty: 'medium',
    question: 'Bcrypt kya hai?',
    options: ['Database', 'Password hashing library', 'CSS framework', 'HTTP client'],
    correctAnswer: 'Password hashing library' },

  // WEB DEV — Subjective (10 questions)
  { domain: 'web-dev', type: 'subjective', difficulty: 'medium',
    question: 'React mein Virtual DOM kya hai aur yeh performance kyun better karta hai?',
    options: [],
    correctAnswer: 'Virtual DOM ek lightweight JavaScript representation hai real DOM ki. React pehle virtual DOM update karta hai, phir diff algorithm se sirf changed parts ko real DOM mein update karta hai, jo direct DOM manipulation se fast hota hai.' },

  { domain: 'web-dev', type: 'subjective', difficulty: 'medium',
    question: 'REST aur GraphQL mein kya farq hai? Kab kaunsa use karein?',
    options: [],
    correctAnswer: 'REST mein fixed endpoints hote hain, GraphQL mein single endpoint se specific data query kar sakte hain. REST simple apps ke liye, GraphQL complex data requirements ke liye better hai.' },

  { domain: 'web-dev', type: 'subjective', difficulty: 'hard',
    question: 'JWT authentication kaise kaam karta hai? Steps mein explain karein.',
    options: [],
    correctAnswer: 'Login pe server JWT generate karta hai (header.payload.signature). Client localStorage mein save karta hai. Har request mein Authorization header mein bhejta hai. Server verify karta hai.' },

  { domain: 'web-dev', type: 'subjective', difficulty: 'easy',
    question: 'CSS Flexbox aur Grid mein kya farq hai?',
    options: [],
    correctAnswer: 'Flexbox 1D layout ke liye (row ya column). Grid 2D layout ke liye (rows aur columns dono). Flexbox components ke liye, Grid page layout ke liye better hai.' },

  { domain: 'web-dev', type: 'subjective', difficulty: 'medium',
    question: 'MongoDB mein indexing kya hai aur kyun zaroori hai?',
    options: [],
    correctAnswer: 'Index ek data structure hai jo queries fast karta hai. Bina index ke MongoDB puri collection scan karta hai. Index se specific fields pe fast search hota hai.' },

  // ═══════════════════════════════════════
  // DATA SCIENCE — MCQ (15 questions)
  // ═══════════════════════════════════════
  { domain: 'data-science', type: 'MCQ', difficulty: 'easy',
    question: 'Machine Learning mein "overfitting" ka kya matlab hai?',
    options: ['Model training data pe bahut zyada fit ho jaata hai', 'Model bilkul kaam nahi karta', 'Data bahut zyada hai', 'Algorithm galat hai'],
    correctAnswer: 'Model training data pe bahut zyada fit ho jaata hai' },

  { domain: 'data-science', type: 'MCQ', difficulty: 'easy',
    question: 'Supervised learning mein kya hota hai?',
    options: ['Data bina labels ke hota hai', 'Labeled training data se model seekhta hai', 'Reinforcement se seekhta hai', 'Clustering karta hai'],
    correctAnswer: 'Labeled training data se model seekhta hai' },

  { domain: 'data-science', type: 'MCQ', difficulty: 'medium',
    question: 'Pandas library kis kaam aati hai?',
    options: ['Machine learning', 'Data manipulation aur analysis', 'Web development', 'Database management'],
    correctAnswer: 'Data manipulation aur analysis' },

  { domain: 'data-science', type: 'MCQ', difficulty: 'medium',
    question: 'Neural network mein "activation function" ka kya kaam hai?',
    options: ['Data normalize karna', 'Non-linearity introduce karna', 'Weights update karna', 'Loss calculate karna'],
    correctAnswer: 'Non-linearity introduce karna' },

  { domain: 'data-science', type: 'MCQ', difficulty: 'hard',
    question: 'Random Forest kya hai?',
    options: ['Single decision tree', 'Multiple decision trees ka ensemble', 'Neural network', 'Linear regression'],
    correctAnswer: 'Multiple decision trees ka ensemble' },

  { domain: 'data-science', type: 'MCQ', difficulty: 'medium',
    question: 'Data normalization kyun ki jaati hai?',
    options: ['Data delete karne ke liye', 'Features ko same scale pe laane ke liye', 'Accuracy badhaane ke liye', 'Model fast karne ke liye'],
    correctAnswer: 'Features ko same scale pe laane ke liye' },

  { domain: 'data-science', type: 'MCQ', difficulty: 'easy',
    question: 'NumPy kya hai?',
    options: ['Web framework', 'Numerical computing library', 'Database', 'Visualization tool'],
    correctAnswer: 'Numerical computing library' },

  { domain: 'data-science', type: 'MCQ', difficulty: 'hard',
    question: 'Gradient Descent kya karta hai?',
    options: ['Data split karta hai', 'Loss function minimize karne ke liye weights update karta hai', 'Model test karta hai', 'Data visualize karta hai'],
    correctAnswer: 'Loss function minimize karne ke liye weights update karta hai' },

  { domain: 'data-science', type: 'MCQ', difficulty: 'medium',
    question: 'Train/Test split kyun karte hain?',
    options: ['Data backup ke liye', 'Model ki unseen data pe performance test karne ke liye', 'Storage bachane ke liye', 'Training fast karne ke liye'],
    correctAnswer: 'Model ki unseen data pe performance test karne ke liye' },

  { domain: 'data-science', type: 'MCQ', difficulty: 'easy',
    question: 'Classification aur Regression mein kya farq hai?',
    options: ['Koi farq nahi', 'Classification discrete labels predict karta hai, Regression continuous values', 'Regression classification se slow hai', 'Classification sirf images ke liye hai'],
    correctAnswer: 'Classification discrete labels predict karta hai, Regression continuous values' },

  // DATA SCIENCE — Subjective (5 questions)
  { domain: 'data-science', type: 'subjective', difficulty: 'medium',
    question: 'Explain karo: Precision aur Recall mein kya farq hai?',
    options: [],
    correctAnswer: 'Precision: predicted positives mein se actual positives. Recall: actual positives mein se correctly predicted. Medical mein recall important, spam detection mein precision.' },

  { domain: 'data-science', type: 'subjective', difficulty: 'hard',
    question: 'K-Means Clustering algorithm kaise kaam karta hai?',
    options: [],
    correctAnswer: 'K centroids randomly initialize karo. Har point ko nearest centroid assign karo. Centroids recalculate karo. Convergence tak repeat karo.' },

  // ═══════════════════════════════════════
  // MOBILE — MCQ (15 questions)
  // ═══════════════════════════════════════
  { domain: 'mobile', type: 'MCQ', difficulty: 'easy',
    question: 'React Native kya hai?',
    options: ['Web framework', 'Cross-platform mobile app framework', 'Database', 'CSS library'],
    correctAnswer: 'Cross-platform mobile app framework' },

  { domain: 'mobile', type: 'MCQ', difficulty: 'easy',
    question: 'Android apps kis language mein likhte hain?',
    options: ['Swift', 'Kotlin/Java', 'Python', 'Ruby'],
    correctAnswer: 'Kotlin/Java' },

  { domain: 'mobile', type: 'MCQ', difficulty: 'easy',
    question: 'iOS apps kis language mein likhte hain?',
    options: ['Kotlin', 'Java', 'Swift/Objective-C', 'Dart'],
    correctAnswer: 'Swift/Objective-C' },

  { domain: 'mobile', type: 'MCQ', difficulty: 'medium',
    question: 'Flutter kaunsi language use karta hai?',
    options: ['JavaScript', 'Dart', 'Python', 'Kotlin'],
    correctAnswer: 'Dart' },

  { domain: 'mobile', type: 'MCQ', difficulty: 'medium',
    question: 'React Native mein `StyleSheet.create()` kya karta hai?',
    options: ['CSS file load karta hai', 'Styles optimize karta hai', 'Theme set karta hai', 'Animation banata hai'],
    correctAnswer: 'Styles optimize karta hai' },

  { domain: 'mobile', type: 'MCQ', difficulty: 'medium',
    question: 'APK file kya hoti hai?',
    options: ['iOS app package', 'Android app package', 'Windows app', 'Source code'],
    correctAnswer: 'Android app package' },

  { domain: 'mobile', type: 'MCQ', difficulty: 'hard',
    question: 'Mobile app mein SQLite kya kaam karta hai?',
    options: ['Online database', 'Local device database storage', 'API calls', 'UI rendering'],
    correctAnswer: 'Local device database storage' },

  { domain: 'mobile', type: 'MCQ', difficulty: 'medium',
    question: 'Push notifications ke liye kaunsi service use hoti hai?',
    options: ['MongoDB', 'Firebase Cloud Messaging (FCM)', 'Express.js', 'Redux'],
    correctAnswer: 'Firebase Cloud Messaging (FCM)' },

  // MOBILE — Subjective (5 questions)
  { domain: 'mobile', type: 'subjective', difficulty: 'medium',
    question: 'Native app aur Hybrid app mein kya farq hai?',
    options: [],
    correctAnswer: 'Native: platform-specific language mein likhi (Swift/Kotlin), best performance. Hybrid: web tech se bani (React Native/Flutter), ek codebase se multiple platforms.' },

  { domain: 'mobile', type: 'subjective', difficulty: 'hard',
    question: 'Mobile app mein offline functionality kaise implement karte hain?',
    options: [],
    correctAnswer: 'SQLite/AsyncStorage se local data store karo. Network check karo. Online hone pe sync karo. Cache strategy implement karo.' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    await Question.deleteMany({});
    console.log('🗑️  Old questions deleted');

    await Question.insertMany(questions);
    console.log(`✅ ${questions.length} questions inserted!`);

    // Count per domain
    const webCount  = questions.filter(q => q.domain === 'web-dev').length;
    const dsCount   = questions.filter(q => q.domain === 'data-science').length;
    const mobCount  = questions.filter(q => q.domain === 'mobile').length;

    console.log(`📊 Web Dev: ${webCount} | Data Science: ${dsCount} | Mobile: ${mobCount}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedDB();