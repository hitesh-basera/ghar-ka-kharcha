const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3190; // Use environment port or 3000

// Create sessions directory
const sessionsDir = path.join(__dirname, 'sessions');
fs.mkdirSync(sessionsDir, { recursive: true });

app.use(session({
    secret: 'hello_xy$_expense_TracKer', // CHANGE THIS!
    resave: true,
    saveUninitialized: true,
    httpOnly: true,
    name: 'kharcha',
    cookie: { secure: false, maxAge:60*60*1000, sameSite: 'none' } // Set to true in production with HTTPS
}));
app.use(cors());
app.use(express.json());

// Database middleware
app.use(async (req, res, next) => {
    if (!sessionStorage.getItem("db_file")) {
        let dbFileName = sessionStorage.getItem("db_file")
        // 1. Check for existing file, but only on the *very first* request of the session
        if (!req.session.dbFileName) { // Check only if dbFileName is NOT set

            const potentialFileName = path.join(sessionsDir, `db_${req.sessionID}.sqlite`);
            if (fs.existsSync(potentialFileName)) {
              //req.session.dbFileName = potentialFileName;
              sessionStorage.setItem('db_file',potentialFileName);
              console.log('dbFileName not set, new db name:'+ req.session.dbFileName);
            }
        }
        if (dbFileName) {
            //dbFileName = req.session.dbFileName;
            req.session.db = new sqlite3.Database(dbFileName, (err) => {
                if (err) return next(err);
                next();
            });
            return;
        }
        // 2. Create if not found:
        const uniqueId = uuidv4(); // Use uuid for better uniqueness
        dbFileName = path.join(sessionsDir, `db_${uniqueId}.sqlite`);

        req.session.dbFileName = dbFileName;

        // Await the session save:
        try {
          await new Promise((resolve, reject) => {
            req.session.save((err) => {
              if (err) reject(err);
              resolve();
            });
          });
        } catch (err) {
          return next(err);
        }
       
        req.session.save((err)=>{
            if(err) return next(err);
            
            req.session.db = new sqlite3.Database(dbFileName, (err) => {
                if (err) return next(err);
    
                // Database initialization (tables, etc.)
                req.session.db.run(`
                    CREATE TABLE IF NOT EXISTS accounts (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      name TEXT UNIQUE NOT NULL,
                      balance REAL NOT NULL
                    )
                  `);
                  req.session.db.run(`
                    CREATE TABLE IF NOT EXISTS transactions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        account_id INTEGER NOT NULL,
                        payee TEXT,
                        date TEXT,
                        notes TEXT,
                        category TEXT,
                        payment REAL,
                        deposit REAL,
                        FOREIGN KEY (account_id) REFERENCES accounts(id)
                        )
                    `);
                    next();
            });
        })
        
    }
    else{
        next();
    }
    
});

app.get('/api/accounts', (req, res) => {
    req.session.db.all('SELECT * FROM accounts', [], (err, rows) => { // Use req.session.db
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });

// Create a new account
app.post('/api/accounts', (req, res) => {
    const { name, balance } = req.body;
    db.run('INSERT INTO accounts (name, balance) VALUES (?, ?)', [name, balance], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Account created' });
    });
  });

// Get transactions for an account
app.get('/api/transactions/:accountId', (req, res) => {
    const accountId = req.params.accountId;
    db.all('SELECT * FROM transactions WHERE account_id = ?', [accountId], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });

// Add a new transaction
app.post('/api/transactions/:accountId', (req, res) => {
    const accountId = req.params.accountId;
    const { payee, date, notes, category, payment, deposit } = req.body;
    db.run('INSERT INTO transactions (account_id, payee, date, notes, category, payment, deposit) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [accountId, payee, date, notes, category, payment, deposit],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Transaction added' });
      });
  });
// Middleware to delete the database file when the session is destroyed
app.use((req, res, next) => {
    res.on('finish', () => {
        if (req.session.destroy || req.session.forceDestroy) { // Check if session was explicitly destroyed
            const dbFileName = req.session.dbFileName;
            if (dbFileName) {
                req.session.db.close((closeErr) => { // Close the database connection first
                    if (closeErr) {
                        console.error("Error closing database:", closeErr);
                    }
                    fs.unlink(dbFileName, (unlinkErr) => { // Then delete the file
                        if (unlinkErr) {
                            console.error("Error deleting database:", unlinkErr);
                        } else {
                          console.log(`Database file ${dbFileName} deleted.`);
                        }
                    });
                });
            }
        }
    });
    next();
  });
  
  
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });