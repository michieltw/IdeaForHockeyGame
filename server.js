import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    if (email === adminEmail && password === adminPassword) {
        // Return dummy user object mapping to admin role for Phase 2 integration
        res.json({
            success: true,
            token: 'dummy-jwt-token',
            user: {
                id: 'admin-001',
                email: email,
                role: 'Admin',
                personId: 'person-admin-001'
            }
        });
    } else if (email === 'league@blackouthockey.com' && password === 'league') {
        res.json({
            success: true,
            token: 'dummy-jwt-token',
            user: {
                id: 'league-001',
                email: email,
                role: 'League Manager',
                personId: 'person-league-001'
            }
        });
    } else if (email === 'team@blackouthockey.com' && password === 'team') {
        res.json({
            success: true,
            token: 'dummy-jwt-token',
            user: {
                id: 'team-001',
                email: email,
                role: 'Team Manager',
                personId: 'person-team-001'
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // For the mock backend, simply return success and sign them in as a Player
    res.json({
        success: true,
        token: 'dummy-jwt-token',
        user: {
            id: 'new-user-' + Date.now(),
            email: email,
            role: 'Player',
            personId: 'person-new-' + Date.now()
        }
    });
});

// Fallback to React index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
