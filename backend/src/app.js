const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  return res.status(200).json({ success: true, message: 'PSWCares API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
