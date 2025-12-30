import express from "express";
import dotenv from "dotenv";
import path from "path";
import userrouter from "./routes/user.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import multer from "multer";

dotenv.config();
const app = express();

app.set("view engine","ejs");
app.set("views", path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse form data from html files 
app.use(express.static('public', {
    etag: false,
    lastModified: false,
    setHeaders: (res, path) => {
        res.set('Cache-Control', 'no-store');
    }
}));


app.use("/users",userrouter);
app.use("/upload", uploadRouter);

app.get("/",async(req,res)=>{
    return res.render("front")
});

app.listen((process.env.PORT || 8000), () =>{
    console.log(`server running on port = ${process.env.PORT}`)
})

