const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const POSTS_FILE = 'posts.json';

// Helper functions
function readPosts() {
    if (!fs.existsSync(POSTS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(POSTS_FILE, 'utf8');
    return JSON.parse(data);
}

function savePosts(posts) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// Routes
app.get('/api/posts', (req, res) => {
    const posts = readPosts();
    res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.id === parseInt(req.params.id));

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
});

app.post('/api/posts', (req, res) => {
    const posts = readPosts();
    const newPost = {
        id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author || 'Anonymous',
        createdAt: new Date().toISOString()
    };

    posts.push(newPost);
    savePosts(posts);

    res.status(201).json(newPost);
});

// TODO: Implement PUT and DELETE endpoints

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
