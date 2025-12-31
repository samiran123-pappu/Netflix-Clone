import express from "express";
import {searchMovie, searchPerson, searchTvShow, getSearchHistory, removeItemFromSearchHistory} from "../controllers/search.controller.js"


const router = express.Router();

router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTvShow);
router.get("/history", getSearchHistory);
router.delete("/history/:id", removeItemFromSearchHistory);



export default router;