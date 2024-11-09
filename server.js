import fetch from 'node-fetch';
import express from 'express';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/search', async (req, res) => {
    const apiKey = 'f5f69bfaf277050667fd882a1bae55f31926e65bb955f696e7b149401ab825b4';
    const query = req.query.q || 'OpenAI';

    try {
        const response = await fetch(`https://serpapi.com/search.json?q=${query}&api_key=${apiKey}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'error while making a request' });
    }
});

app.post('/save', (req, res) => {
    const { organicResults, query } = req.body;

    const safeQuery = query.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeQuery}.json`;

    fs.writeFile(fileName, JSON.stringify(organicResults, null, 2), (err) => {
        if (err) {
            console.error('Error while saving file:', err);
            res.status(500).json({ message: 'Error while saving file:' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is runing`);
});
