// scanner.js - Enhanced XML File Scanner with Content Change Detection
class XMLFileScanner {
    constructor() {
        this.cache = new Map(); // Cache for file existence
        this.contentCache = new Map(); // Cache for file content/checksum
        this.scanInterval = null;
        this.lastScanResults = [];
        this.fileChecksums = new Map(); // Store file checksums
    }
    
    // Generate a simple checksum for file content
    generateChecksum(content) {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36);
    }
    
    // Get file content and checksum
    async getFileInfo(url) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const content = await response.text();
                const checksum = this.generateChecksum(content);
                const lastModified = response.headers.get('last-modified') || 
                                    response.headers.get('date') || 
                                    new Date().toISOString();
                
                return {
                    content,
                    checksum,
                    lastModified,
                    size: content.length,
                    exists: true
                };
            }
            return { exists: false };
        } catch (error) {
            return { exists: false };
        }
    }
    
    // Method to scan directory for XML files with content monitoring
    async scanDirectory(basePath) {
        console.log(`🔍 Scanning directory: ${basePath}`);
        
        try {
            // Get list of potential XML files using multiple methods
            const fileNames = await this.discoverFiles(basePath);
            const fileDetails = [];
            
            // Get details for each file
            for (const fileName of fileNames) {
                const fileUrl = `${basePath}${fileName}.xml`;
                const fileInfo = await this.getFileInfo(fileUrl);
                
                if (fileInfo.exists) {
                    fileDetails.push({
                        name: fileName,
                        url: fileUrl,
                        checksum: fileInfo.checksum,
                        lastModified: fileInfo.lastModified,
                        size: fileInfo.size
                    });
                }
            }
            
            return fileDetails;
            
        } catch (error) {
            console.error('Directory scan error:', error);
            return [];
        }
    }
    
    // Discover XML files using multiple methods
    async discoverFiles(basePath) {
        const foundFiles = new Set();
        
        // Method 1: Try index files
        const indexFiles = await this.tryIndexFile(basePath);
        indexFiles.forEach(file => foundFiles.add(file));
        
        // Method 2: Try directory listing
        const dirFiles = await this.tryDirectoryListing(basePath);
        dirFiles.forEach(file => foundFiles.add(file));
        
        // Method 3: Try pattern scanning
        const patternFiles = await this.tryPatternScanning(basePath);
        patternFiles.forEach(file => foundFiles.add(file));
        
        // Method 4: Check chapters.json
        const chapterFiles = await this.checkChaptersJson(basePath);
        chapterFiles.forEach(file => foundFiles.add(file));
        
        return Array.from(foundFiles);
    }
    
    // Method 1: Try to read an index file
    async tryIndexFile(basePath) {
        const indexFiles = [
            'index.txt',
            'files.txt',
            'chapters.txt',
            'list.txt',
            'manifest.txt',
            'xml-list.txt'
        ];
        
        for (const indexFile of indexFiles) {
            try {
                const response = await fetch(`${basePath}${indexFile}`);
                if (response.ok) {
                    const text = await response.text();
                    const files = text.split('\n')
                        .map(line => line.trim())
                        .filter(line => line && (line.endsWith('.xml') || line.includes('.xml')))
                        .map(line => {
                            // Extract filename without .xml extension
                            const match = line.match(/([^\/]+?)\.xml$/i);
                            return match ? match[1] : line.replace('.xml', '');
                        })
                        .filter(file => file.length > 0);
                    
                    if (files.length > 0) {
                        console.log(`✅ Found ${files.length} files via ${indexFile}`);
                        return files;
                    }
                }
            } catch (error) {
                // Silently continue to next method
            }
        }
        
        return [];
    }
    
    // Method 2: Try directory listing (depends on server configuration)
    async tryDirectoryListing(basePath) {
        try {
            // This only works if the server returns directory listings
            const response = await fetch(basePath);
            if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Extract links from directory listing
                const links = Array.from(doc.querySelectorAll('a[href$=".xml"], a[href*=".xml"]'))
                    .map(a => a.getAttribute('href'))
                    .filter(href => href && !href.startsWith('http') && !href.startsWith('#'))
                    .map(href => {
                        // Extract filename without .xml extension
                        const match = href.match(/([^\/]+?)\.xml$/i);
                        return match ? match[1] : href.replace('.xml', '');
                    })
                    .filter(file => file.length > 0);
                
                if (links.length > 0) {
                    console.log(`✅ Found ${links.length} files via directory listing`);
                    return links;
                }
            }
        } catch (error) {
            // Silently continue
        }
        
        return [];
    }
    
    // Method 3: Try scanning for common XML file patterns
    async tryPatternScanning(basePath) {
        const commonPatterns = [
            'chapter-', 'quiz-', 'test-', 'questions-',
            'unit-', 'lesson-', 'topic-', 'module-',
            'ch-', 'q-', 't-', 'ex-'
        ];
        
        const foundFiles = [];
        const maxChecks = 30; // Check up to 30 files
        
        // Try numeric patterns (chapter-1.xml, chapter-2.xml, etc.)
        for (let i = 1; i <= maxChecks; i++) {
            for (const pattern of commonPatterns) {
                const testPath = `${basePath}${pattern}${i}.xml`;
                if (await this.testFileExists(testPath)) {
                    foundFiles.push(`${pattern}${i}`);
                }
                
                // Also try with zero-padded numbers
                const paddedNum = i.toString().padStart(2, '0');
                const paddedPath = `${basePath}${pattern}${paddedNum}.xml`;
                if (await this.testFileExists(paddedPath)) {
                    foundFiles.push(`${pattern}${paddedNum}`);
                }
            }
        }
        
        // Try common names
        const commonNames = [
            'questions', 'quiz', 'test', 'exam', 'practice',
            'exercise', 'problems', 'review', 'final', 'midterm',
            'chapter1', 'chapter2', 'chapter3', 'unit1', 'unit2',
            'algebra', 'geometry', 'calculus', 'physics', 'chemistry'
        ];
        
        for (const name of commonNames) {
            const testPath = `${basePath}${name}.xml`;
            if (await this.testFileExists(testPath)) {
                foundFiles.push(name);
            }
        }
        
        return foundFiles;
    }
    
    // Method 4: Check chapters.json for file list
    async checkChaptersJson(basePath) {
        try {
            const response = await fetch(`${basePath}chapters.json`);
            if (response.ok) {
                const chapters = await response.json();
                if (Array.isArray(chapters)) {
                    return chapters
                        .filter(chapter => chapter && typeof chapter === 'string')
                        .map(chapter => chapter.trim())
                        .filter(chapter => chapter.length > 0);
                }
            }
        } catch (error) {
            // Continue with pattern scanning
        }
        
        return [];
    }
    
    // Helper method to test if a file exists (quick HEAD request)
    async testFileExists(url) {
        try {
            // Check cache first (cache for 30 seconds)
            const cacheKey = `exists:${url}`;
            const cached = this.cache.get(cacheKey);
            if (cached && (Date.now() - cached.timestamp) < 30000) {
                return cached.exists;
            }
            
            const response = await fetch(url, { method: 'HEAD' });
            const exists = response.ok;
            
            // Cache the result
            this.cache.set(cacheKey, {
                exists,
                timestamp: Date.now()
            });
            
            return exists;
        } catch (error) {
            return false;
        }
    }
    
    // Start periodic scanning with content monitoring
    startScanning(basePath, interval = 30000) {
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
        }
        
        // Initial scan
        this.performScan(basePath);
        
        // Periodic scans
        this.scanInterval = setInterval(() => {
            this.performScan(basePath);
        }, interval);
    }
    
    // Perform a complete scan with change detection
    async performScan(basePath) {
        console.log(`🔄 Performing scan of ${basePath}`);
        
        try {
            const currentFiles = await this.scanDirectory(basePath);
            const changes = this.detectChanges(currentFiles);
            
            // Update last scan results
            this.lastScanResults = currentFiles;
            
            // If there are changes and we have a callback, trigger it
            if (changes.hasChanges && this.onChange) {
                this.onChange(changes);
            }
            
            return changes;
        } catch (error) {
            console.error('Scan error:', error);
            return { hasChanges: false };
        }
    }
    
    // Detect changes between current and previous scan
    detectChanges(currentFiles) {
        const changes = {
            hasChanges: false,
            added: [],
            removed: [],
            modified: [],
            unchanged: [],
            allFiles: currentFiles.map(f => f.name)
        };
        
        // Create maps for easy comparison
        const currentMap = new Map();
        currentFiles.forEach(file => {
            currentMap.set(file.name, file);
        });
        
        const previousMap = new Map();
        this.lastScanResults.forEach(file => {
            previousMap.set(file.name, file);
        });
        
        // Check for added files
        for (const [name, file] of currentMap) {
            if (!previousMap.has(name)) {
                changes.added.push(file);
                changes.hasChanges = true;
            }
        }
        
        // Check for removed files
        for (const [name, file] of previousMap) {
            if (!currentMap.has(name)) {
                changes.removed.push(file);
                changes.hasChanges = true;
            }
        }
        
        // Check for modified files
        for (const [name, currentFile] of currentMap) {
            const previousFile = previousMap.get(name);
            if (previousFile) {
                // Compare checksums or last modified dates
                if (currentFile.checksum !== previousFile.checksum || 
                    currentFile.lastModified !== previousFile.lastModified ||
                    currentFile.size !== previousFile.size) {
                    
                    changes.modified.push({
                        name,
                        previous: previousFile,
                        current: currentFile,
                        changes: {
                            contentChanged: currentFile.checksum !== previousFile.checksum,
                            sizeChanged: currentFile.size !== previousFile.size,
                            timeChanged: currentFile.lastModified !== previousFile.lastModified
                        }
                    });
                    changes.hasChanges = true;
                } else {
                    changes.unchanged.push(currentFile);
                }
            }
        }
        
        // Log changes for debugging
        if (changes.hasChanges) {
            console.log('📊 Scan detected changes:', {
                added: changes.added.length,
                removed: changes.removed.length,
                modified: changes.modified.length,
                unchanged: changes.unchanged.length
            });
            
            if (changes.modified.length > 0) {
                console.log('📝 Modified files:', changes.modified.map(m => m.name));
            }
        }
        
        return changes;
    }
    
    // Stop scanning
    stopScanning() {
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
    }
    
    // Force a refresh of a specific file (clear cache and reload)
    async refreshFile(fileName, basePath) {
        const fileUrl = `${basePath}${fileName}.xml`;
        
        // Clear cache for this file
        this.cache.delete(`exists:${fileUrl}`);
        this.contentCache.delete(fileUrl);
        
        // Get fresh file info
        return await this.getFileInfo(fileUrl);
    }
    
    // Get cached content for a file
    getCachedContent(fileName, basePath) {
        const fileUrl = `${basePath}${fileName}.xml`;
        return this.contentCache.get(fileUrl);
    }
    
    // Set change callback
    onChange(callback) {
        this.onChange = callback;
    }
    
    // Clean up cache (remove old entries)
    cleanupCache(maxAge = 3600000) { // 1 hour default
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > maxAge) {
                this.cache.delete(key);
            }
        }
    }
}

// Export scanner for use in main app
window.XMLFileScanner = XMLFileScanner;
