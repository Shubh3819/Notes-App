const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views'))); // For CSS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
    res.render("home", { cards: cards });
});

const cards = [];
let idCounter = 1;


app.post('/submit', function (req, res) {
    const { title, body } = req.body;
    if (title && body) {
        cards.push({ id: idCounter++, title, body });
    }

    const folderPath = path.join(__dirname, 'files');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        const fileName = `card-${Date.now()}.txt`;
        const filePath = path.join(folderPath, fileName);

        // Prepare content
        const content = `Title: ${title}\nBody: ${body}`;

        // Write file
        fs.writeFileSync(filePath, content, 'utf8');
    
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    const idToDelete = parseInt(req.params.id);
    const index = cards.findIndex(card => card.id === idToDelete);
    if (index !== -1) {
        cards.splice(index, 1);
    }
    res.redirect('/');
});

app.get('/submit/:id', (req, res) => {
    const cardId = parseInt(req.params.id);
    const card = cards.find(c => c.id === cardId);
    
    if (!card) {
        return res.status(404).send('Card not found');
    }
    res.render('detail', { card }); // Render a detail view instead
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});

