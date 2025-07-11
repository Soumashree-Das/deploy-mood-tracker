import express from "express";
import connectDB from "./src/db/db.index.js";
import cors from "cors";
//routes
import UserRouter from "./src/routes/user.route.js";
import JournalRouters from "./src/routes/journalEntry.routes.js";
import ChatBotRouters from "./src/routes/chatbot.routes.js"

const app = express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

// app.options("*", cors()); // enable pre-flight for all routes

app.use(express.json());
app.use("/user",UserRouter);
app.use("/journal",JournalRouters);
app.use("/c",ChatBotRouters);


connectDB().then(()=>{
    app.listen(process.env.PORT||9000 , () => {
        console.log(`Server running on port : ${process.env.PORT || 9000}`)
    })
})




