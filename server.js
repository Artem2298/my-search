import fetch from 'node-fetch';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.apiKey;

app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

app.get('/search', async (req, res) => {
    const query = req.query.q || 'OpenAI';

    try {
        const response = await fetch(`https://serpapi.com/search.json?q=${query}&api_key=${apiKey}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error while making a request:', error);
        res.status(500).json({ error: 'Error while making a request' });
    }
});

app.post('/save', (req, res) => {
    const { organicResults, query } = req.body;

    const safeQuery = query.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeQuery}.json`;

    fs.writeFile(fileName, JSON.stringify(organicResults, null, 2), (err) => {
        if (err) {
            console.error('Error while saving file:', err);
            res.status(500).json({ message: 'Error while saving file' });
        } else {
            console.log(`File ${fileName} saved successfully.`);
            res.json({ message: `File ${fileName} saved successfully.` });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
