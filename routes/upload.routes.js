import express from "express";
import multer from "multer";
import indexFiles from "../PDF-Embed.js";
const router = express.Router();


const upload = multer({
    storage:multer.memoryStorage(),
    limits:{fileSize:10*1024*1024}, // 10MB
});

router.post("/file", upload.array("files"), async(req,res)=>{
    try {
        if(!req.files || req.files.length===0){
            console.log("error occured during file upload!!!");
            return res.status(400).json({ error: "No files uploaded" });
        }

        await indexFiles(req.files);

        console.log("file uploaded successfully!!!");
        console.log("Files received:", req.files.map(f => f.originalname));

        res.json({ message: "Files received successfully" });
    } catch (error) {
        console.log("error occured ---->", error);
        res.status(500).json({ error: "Upload failed" });
    }
})

export default router;