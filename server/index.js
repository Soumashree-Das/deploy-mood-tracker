import express from "express";
import connectDB from "./src/db/db.index.js";
import cors from "cors";

import UserRouter from "./src/routes/user.route.js";
import JournalRouters from "./src/routes/journalEntry.routes.js";

const app = express();

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'https://deploy-mood-tracker.vercel.app/');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     next();
//   });

app.use(cors({
    origin:'https://deploy-mood-tracker.vercel.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials:true
}))



// // Handle OPTIONS requests for all routes
// app.options('*', cors({
//     origin: 'https://deploy-mood-tracker.vercel.app',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));

app.use(express.json());
app.use("/user",UserRouter);
app.use("/journal",JournalRouters);


connectDB().then(()=>{
    app.listen(process.env.PORT||9000 , () => {
        console.log(`Server running on port : ${process.env.PORT || 9000}`)
    })
})




