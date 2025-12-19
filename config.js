const GOOGLE_SHEETS_CONFIG = {
    // Replace with your Google Sheet ID
    SHEET_ID: '1G6tTHT56T6FmqOwOvVFVPoVqoSs-TSBz_-SiW9imQvk',
    
    // Replace with your Sheet GID (usually 0 for first sheet)
    GID: '0',
    
    // API endpoint to fetch sheet data
    get API_URL() {
        return `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:json&gid=${this.GID}`;
    }
};

// WhatsApp Configuration
const WHATSAPP_CONFIG = {
    ENABLED: true, // Set to false to disable
    PHONE_NUMBER: '919706195457', // Replace with your WhatsApp number (with country code, no +)
    MESSAGE_TEMPLATE: {
        LOGIN: "🔔 *New User Login* 🔔\n👤 Username: {username}\n📛 Name: {name}\n🏫 Class: {class}\n👥 Role: {role}\n📅 Date: {date}\n⏰ Time: {time}\n🌐 IP: {ip}",
        QUIZ_RESULT: "📊 *Quiz Result* 📊\n👤 Username: {username}\n📛 Name: {name}\n🏫 Class: {class}\n📚 Subject: {subject}\n📖 Chapter: {chapter}\n✅ Correct: {correct}\n📋 Total: {total}\n📈 Score: {percentage}%\n⏱️ Time: {timeTaken}\n📅 Date: {date}"
    }
};

// Telegram Configuration
const TELEGRAM_CONFIG = {
    ENABLED: true, // Set to false to disable
    BOT_TOKEN: '8355903870:AAHLCnFWPwwzk7Q22gpvV8ITEmzBjqthB8Q', // Replace with your bot token
    CHAT_ID: '5903174042', // Replace with your chat ID
    MESSAGE_TEMPLATE: {
        LOGIN: "🔔 *New User Login* 🔔\n👤 Username: {username}\n🎓 Name: {name}\n🏫 Class: {class}\n👥 Role: {role}\n📅 Date: {date}\n⏰ Time: {time}\n🌐 IP: {ip}",
        QUIZ_RESULT: "📊 *Quiz Result* 📊\n👤 Username: {username}\n🎓 Name: {name}\n🏫 Class: {class}\n📚 Subject: {subject}\n📖 Chapter: {chapter}\n✅ Correct: {correct}\n📋 Total: {total}\n🔷 Attempted: {attempted}\n📈 Score: {percentage}%\n⏱️ Time Taken: {timeTaken}\n📅 Date: {date}"
    }
};

// Logo configuration
const LOGO_CONFIG = {
    src: 'logo.png',
    alt: 'G. S. Tutorial Logo',
    width: '40px',
    height: '40px'
};

// Logging Configuration
const LOGGING_CONFIG = {
    ENABLE_CONSOLE_LOG: true,
    LOG_LEVEL: 'INFO',
    AUTO_SEND_NOTIFICATIONS: true
};
