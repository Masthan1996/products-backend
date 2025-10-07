require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { connect } = require('./config/db');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req,res) => res.send('Task Workflow API'));

const PORT = process.env.PORT || 4000;
connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log('Server running on', PORT));
}).catch(err => {
  console.error('DB connect error', err);
  process.exit(1);
});
