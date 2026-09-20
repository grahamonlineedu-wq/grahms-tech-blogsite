require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function requireSupabase(req, res, next) {
  if (!supabase) {
    return res.status(503).json({
      error: 'Supabase is not configured. Add SUPABASE_URL and SUPABASE_KEY to your environment variables.'
    });
  }

  next();
}

// GET all posts
app.get('/api/posts', requireSupabase, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Supabase fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch posts from cloud database' });
  }
});

// POST new article
app.post('/api/posts', requireSupabase, async (req, res) => {
  try {
    const { title, category, excerpt, content, image_url } = req.body;

    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, category, excerpt, content, image_url }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Supabase insert error:', err.message);
    res.status(400).json({ error: 'Failed to publish post' });
  }
});

// DELETE article
app.delete('/api/posts/:id', requireSupabase, async (req, res) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Post removed successfully' });
  } catch (err) {
    console.error('Supabase delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Route not found' });
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Supabase-backed platform running at http://localhost:${PORT}`));
}

module.exports = app;
