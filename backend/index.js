import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

dotenv.config();

const app  = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ── Supabase ───────────────────────────────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ── Config ─────────────────────────────────────────────────────────────────────
// FIX #4: Throw hard error if JWT_SECRET is missing — never run with a hardcoded fallback in prod
const JWT_SECRET     = process.env.JWT_SECRET;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables.');
}

// ── Auth Middleware ────────────────────────────────────────────────────────────
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};


// ── AUTH ROUTES ────────────────────────────────────────────────────────────────

app.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, and password are required.' });
    }

    // FIX #3: .single() throws PGRST116 when no row found — that's expected, not an error
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (lookupError && lookupError.code !== 'PGRST116') {
      // Genuine DB error (not "no rows found")
      throw lookupError;
    }

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Hash password
    const salt          = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password_hash }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign(
      { id: data.id, email: data.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({ token, user: { id: data.id, username, email } });

  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required.' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    // Use same generic error for both "not found" and "wrong password" — prevents email enumeration
    if (error || !user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


// ── PREDICTION ROUTES ──────────────────────────────────────────────────────────

app.post('/api/predict', authenticateToken, async (req, res) => {
  try {
    const employeeData = req.body;

    // FIX #1 + #2: Add timeout + properly surface ML service errors
    let mlResponse;
    try {
      mlResponse = await axios.post(
        `${ML_SERVICE_URL}/predict`,
        employeeData,
        { timeout: 10000 }   // FIX #2: 10s timeout — never hang indefinitely
      );
    } catch (axiosError) {
      // FIX #1: Surface the actual ML service validation/error message
      const mlError = axiosError.response?.data?.detail
        || axiosError.response?.data
        || axiosError.message
        || 'ML service unreachable';

      console.error('ML service error:', mlError);
      return res.status(axiosError.response?.status || 502).json({
        error: 'ML service error',
        detail: mlError
      });
    }

    const predictionData = mlResponse.data;

    // Store prediction in Supabase
    const { data, error } = await supabase
      .from('prediction_history')
      .insert([{
        user_id          : req.user.id,
        employee_data    : employeeData,
        prediction_result: predictionData.prediction,
        probability      : predictionData.probability,
        reasons          : predictionData.reasons,
        solutions        : predictionData.solutions
      }])
      .select();

    if (error) throw error;

    const history_id = data && data.length > 0 ? data[0].id : null;

    res.json({ ...predictionData, history_id });

  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


// ── HISTORY & STATS ROUTES ─────────────────────────────────────────────────────

app.get('/api/history', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('prediction_history')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);

  } catch (error) {
    console.error('History error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('prediction_history')
      .select('prediction_result')
      .eq('user_id', req.user.id);

    if (error) throw error;

    const total        = data.length;
    const left         = data.filter(d => d.prediction_result === 'Leave').length;
    const stayed       = total - left;
    const attritionRate = total > 0 ? parseFloat(((left / total) * 100).toFixed(1)) : 0;

    res.json({
      totalEmployeesEvaluated: total,
      employeesStayed        : stayed,
      employeesLeft          : left,
      attritionRate
    });

  } catch (error) {
    console.error('Stats error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


// ── HEALTH ─────────────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend service is running' });
});


// ── START ──────────────────────────────────────────────────────────────────────

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});