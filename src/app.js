const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
 
const cookieTokenRoute = require('./routes/CookieTokenRoute');
const postRoute = require('./routes/postRoute');
const commentRoute = require('./routes/commentRoute');
const orderRoute = require('./routes/orderRoute');

const app = express();
app.use(bodyParser.json()); // parse JSON body
// Enable CORS globally
app.use(cors());


app.get('/status', (req, res) => res.json({ success: true, status: "Server is running." }));
app.use('/cookies', cookieTokenRoute);
app.use('/posts', postRoute);
app.use('/comments', commentRoute);
app.use('/orders', orderRoute);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
