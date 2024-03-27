const express = require("express");
const router = express.Router();

const ReactionController = require("../../controller/API/ReactionController");
//Get the reaction of a post with a user
router.get("/get-reaction-by-user", ReactionController.GetReactionByUser);
//get all reactions of a post or a comment
router.get("/get-all-reactions", ReactionController.GetAllReactions);
router.post("/create-reaction", ReactionController.CreateReaction);

module.exports = router;
