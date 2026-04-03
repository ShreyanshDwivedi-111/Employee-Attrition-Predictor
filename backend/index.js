import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ROUTES ---

app.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user into DB
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password_hash }])
      .select()
      .single();

    if (error) throw error;

    // Generate token
    const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, { expiresIn: '2h' });

    res.status(201).json({ token, user: { id: data.id, username, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- PREDICTION ROUTES ---

app.post('/api/predict', authenticateToken, async (req, res) => {
  try {
    const employeeData = req.body;

    // Call ML Microservice
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, employeeData);
    const predictionData = mlResponse.data;

    // Store in Supabase
    const { data, error } = await supabase
      .from('prediction_history')
      .insert([{
        user_id: req.user.id,
        employee_data: employeeData,
        prediction_result: predictionData.prediction,
        probability: predictionData.probability,
        reasons: predictionData.reasons,
        solutions: predictionData.solutions
      }])
      .select();

    if (error) throw error;

    // In case supabase doesn't return the row properly, we still want to return the prediction string
    const history_id = data && data.length > 0 ? data[0].id : null;

    res.json({ ...predictionData, history_id });
  } catch (error) {
    console.error("Prediction Error:", error.message);
    res.status(500).json({ error: error.message || 'Error communicating with ML service' });
  }
});

// --- HISTORY & STATS ROUTES ---

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
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    // A simplified statistics route calculating based on history.
    // In a real scenario, this might query an entire employee base. 
    // Here we query prediction history to build stats.
    const { data, error } = await supabase
      .from('prediction_history')
      .select('prediction_result')
      .eq('user_id', req.user.id);

    if (error) throw error;

    const total = data.length;
    const left = data.filter(d => d.prediction_result === 'Leave').length;
    const stayed = total - left;
    const attritionRate = total > 0 ? ((left / total) * 100).toFixed(1) : 0;

    res.json({
      totalEmployeesEvaluated: total,
      employeesStayed: stayed,
      employeesLeft: left,
      attritionRate: parseFloat(attritionRate)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend service is running' });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
