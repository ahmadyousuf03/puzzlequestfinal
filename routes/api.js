const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const puzzlesPath = path.join(__dirname, '../data/puzzles.json');
const leaderboardPath = path.join(__dirname, '../data/leaderboard.json');

const readFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const writeFile = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

router.get('/puzzles', (req, res) => {
    const puzzles = readFile(puzzlesPath);
    res.json(puzzles);
});

router.get('/hints/:id', (req, res) => {
    const puzzles = readFile(puzzlesPath);
    const puzzle = puzzles.find(p => p.id === req.params.id);
    puzzle ? res.json({ hint: puzzle.hint }) : res.status(404).json({ error: 'Puzzle not found' });
});

router.post('/submit-answer', (req, res) => {
    const { id, answer, player } = req.body;
    const puzzles = readFile(puzzlesPath);
    const leaderboard = readFile(leaderboardPath);

    const puzzle = puzzles.find(p => p.id === id);
    if (puzzle && puzzle.answer.toLowerCase() === answer.toLowerCase()) {
        const playerEntry = leaderboard.find(entry => entry.player === player);
        if (playerEntry) {
            playerEntry.score += 10;
        } else {
            leaderboard.push({ player, score: 10 });
        }
        writeFile(leaderboardPath, leaderboard);
        res.json({ correct: true });
    } else {
        res.json({ correct: false });
    }
});

router.get('/leaderboard', (req, res) => {
    const leaderboard = readFile(leaderboardPath);
    res.json(leaderboard.sort((a, b) => b.score - a.score));
});

module.exports = router;
