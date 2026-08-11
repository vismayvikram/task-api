const dotenv = require('dotenv');

const PORT = process.env.PORT || 3000;

const app = require('./app');

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
