const express = require('express');
const { exec } = require('child_process');
const app = express();

app.get('/voice', (req, res) => {
  const command = req.query.q;
  if (!command) return res.status(400).send('Missing command');
  // Placeholder: integrate with speech recognition/assistant
  console.log('Voice command:', command);
  res.json({ received: command });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Voice server running on ${port}`));
