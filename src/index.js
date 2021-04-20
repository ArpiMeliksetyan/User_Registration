require('dotenv').config();
const express = require('express');
require('./repository/mongoose');
const userRouter = require('./routers/user');
const postRouter = require('./routers/post');



const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use('/api/v1/users',userRouter);
app.use('/api/v1/posts',postRouter);





app.listen(port, () => console.log('Server is running'))