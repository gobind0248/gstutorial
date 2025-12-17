// ========== GOOGLE SHEETS CONFIGURATION ==========
const GOOGLE_SHEETS_CONFIG = {
    SHEET_ID: '1G6tTHT56T6FmqOwOvVFVPoVqoSs-TSBz_-SiW9imQvk',
    GID: '0',
    get API_URL() {
        return `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:json&gid=${this.GID}`;
    }
};

// ========== WHATSAPP NOTIFICATION CONFIG ==========
const WHATSAPP_CONFIG = {
    ENABLED: true, // Set to true to enable WhatsApp notifications
    PHONE_NUMBER: '919706195457', // Your WhatsApp phone number with country code
    MESSAGE_TEMPLATE: {
        LOGIN: "🔔 *New User Login* 🔔\n👤 Username: {username}\n📛 Name: {name}\n🏫 Class: {class}\n👥 Role: {role}\n📅 Date: {date}\n⏰ Time: {time}\n🌐 IP: {ip}",
        QUIZ_RESULT: "📊 *Quiz Result* 📊\n👤 Username: {username}\n📛 Name: {name}\n🏫 Class: {class}\n📚 Subject: {subject}\n📖 Chapter: {chapter}\n✅ Correct: {correct}\n📋 Total: {total}\n📈 Score: {percentage}%\n⏱️ Time: {timeTaken}\n📅 Date: {date}",
        QUESTION_EDITED: "📝 *Question Edited* 📝\n👤 Edited by: {editor}\n🏫 Class: {class}\n📚 Subject: {subject}\n📖 Chapter: {chapter}\n❓ Question No: {questionNo}\n✅ Status: {status}\n📅 Date: {date}",
        QUESTION_ADDED: "➕ *New Question Added* ➕\n👤 Added by: {editor}\n🏫 Class: {class}\n📚 Subject: {subject}\n📖 Chapter: {chapter}\n✅ Status: {status}\n📅 Date: {date}"
    }
};

// ========== TELEGRAM NOTIFICATION CONFIG ==========
const TELEGRAM_CONFIG = {
    ENABLED: true, // Set to true to enable Telegram notifications
    BOT_TOKEN: '8355903870:AAHLCnFWPwwzk7Q22gpvV8ITEmzBjqthB8Q', // Your Telegram Bot Token
    CHAT_ID: '5903174042', // Your Telegram Chat ID
    MESSAGE_TEMPLATE: {
        LOGIN: "🔔 *New User Login* 🔔\n👤 Username: {username}\n📛 Name: {name}\n🏫 Class: {class}\n👥 Role: {role}\n📅 Date: {date}\n⏰ Time: {time}\n🌐 IP: {ip}",
        QUIZ_RESULT: "📊 *Quiz Result* 📊\n👤 Username: {username}\n📛 Name: {name}\n🏫 Class: {class}\n📚 Subject: {subject}\n📖 Chapter: {chapter}\n✅ Correct: {correct}\n📋 Total: {total}\n📈 Score: {percentage}%\n⏱️ Time: {timeTaken}\n📅 Date: {date}",
        QUESTION_EDITED: "📝 *Question Edited* 📝\n👤 Edited by: {editor}\n🏫 Class: {class}\n📚 Subject: {subject}\n📖 Chapter: {chapter}\n❓ Question No: {questionNo}\n✅ Status: {status}\n📅 Date: {date}",
        QUESTION_ADDED: "➕ *New Question Added* ➕\n👤 Added by: {editor}\n🏫 Class: {class}\n📚 Subject: {subject}\n📖 Chapter: {chapter}\n✅ Status: {status}\n📅 Date: {date}"
    }
};

// ========== GITHUB ADMIN EDIT CONFIG =========
const GITHUB_CONFIG = {
    ENABLED: true, // Set to true to enable GitHub-based question editing
    REPO: 'gobind0248/gstutorial', // Your GitHub repository (format: username/repo-name)
    TOKEN: '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', // Your GitHub Personal Access Token
    BRANCH: 'main', // Default branch
    COMMIT_MESSAGE: 'Question updated by admin',
    ADD_COMMIT_MESSAGE: 'New question added by admin'
};

// ========== APP VERSION ==========
const APP_VERSION = '2.0.0';
const LAST_UPDATED = '2025-12-17';

// Export configurations (for module usage)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GOOGLE_SHEETS_CONFIG,
        WHATSAPP_CONFIG,
        TELEGRAM_CONFIG,
        GITHUB_CONFIG,
        APP_VERSION,
        LAST_UPDATED
    };
}
