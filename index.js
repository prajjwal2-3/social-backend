const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
// const adminRouter = require("./routes/admin")
const userRouter = require("./routes/user");
app.use(cors('http://localhost:3000/','https://zemer.vercel.app/'))
// app.use(cors({*}))
app.use(bodyParser.json());
// app.use("/admin", adminRouter)
app.use("/user", userRouter)

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
module.exports=app;