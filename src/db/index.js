class Database {
  constructor() {
    this.dbName = 'contentShakeDB';
    this.version = 1;
    this.db = null;
    this.initPromise = null;
  }

  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      // Delete existing database
      const deleteRequest = indexedDB.deleteDatabase(this.dbName);

      deleteRequest.onsuccess = () => {
        // Create new database
        const request = indexedDB.open(this.dbName, this.version);

        request.onerror = (event) => {
          console.error('Database error:', event.target.error);
          reject(event.target.error);
        };

        request.onblocked = (event) => {
          console.error('Database blocked:', event);
          reject(new Error('Database blocked'));
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          console.log('Database opened successfully');
          resolve(this.db);
        };

        request.onupgradeneeded = (event) => {
          console.log('Creating database schema');
          const db = event.target.result;

          // Create settings store
          if (!db.objectStoreNames.contains('settings')) {
            const settingsStore = db.createObjectStore('settings', { keyPath: 'id' });
            
            // Create initial data
            settingsStore.add({
              id: 'customModels',
              value: ['gpt-3.5-turbo', 'gpt-4'],
              updatedAt: new Date()
            });
          }

          // Create API settings store
          if (!db.objectStoreNames.contains('apiSettings')) {
            db.createObjectStore('apiSettings', { 
              keyPath: 'id', 
              autoIncrement: true 
            });
          }
        };
      };

      deleteRequest.onerror = (event) => {
        console.error('Could not delete database:', event.target.error);
        reject(event.target.error);
      };
    });

    return this.initPromise;
  }

  async ensureStore(storeName) {
    if (!this.db) {
      await this.init();
    }

    if (!this.db.objectStoreNames.contains(storeName)) {
      throw new Error(`Store ${storeName} not found`);
    }
  }

  async saveCustomModels(models) {
    await this.ensureStore('settings');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      
      const request = store.put({
        id: 'customModels',
        value: models,
        updatedAt: new Date()
      });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCustomModels() {
    await this.ensureStore('settings');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get('customModels');
      
      request.onsuccess = () => {
        resolve(request.result?.value || ['gpt-3.5-turbo', 'gpt-4']);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveApiSettings(settings) {
    await this.ensureStore('apiSettings');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['apiSettings'], 'readwrite');
      const store = transaction.objectStore('apiSettings');
      
      const request = store.add({
        ...settings,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getApiSettings() {
    await this.ensureStore('apiSettings');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['apiSettings'], 'readonly');
      const store = transaction.objectStore('apiSettings');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async clearStore(storeName) {
    await this.ensureStore(storeName);
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDatabase() {
    this.db?.close();
    this.db = null;
    this.initPromise = null;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.dbName);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Create singleton instance
const db = new Database();

// Initialize database immediately
db.init().catch(error => {
  console.error('Failed to initialize database:', error);
});

export default db;
