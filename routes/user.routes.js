import { Router } from "express";
import {chat} from "../chat.js";
import {TextToDb} from "../PDF-Embed.js";
const router = Router();


router.route("/chat").post(chat);
router.route("/index-text").post(TextToDb);
export default router;