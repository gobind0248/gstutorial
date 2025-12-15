// Google Sheets Configuration
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

// Logo configuration
const LOGO_CONFIG = {
    src: 'logo.png',
    alt: 'G. S. Tutorial Logo',
    width: '40px',
    height: '40px'
};
