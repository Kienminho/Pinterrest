const _Reaction = require("../../model/Reaction");
const _Post = require("../../model/Post");
const _User = require("../../model/User");
const _Comment = require("../../model/Comment");
const Utils = require("../../common/Utils");

const CreateReaction = async (req, res) => {
  try {
    const { postOrCommentId, userId, icon, isPost } = req.body;
    const user = await _User.findById(userId);

    if (isPost === null) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("isPost is required", false));
    }

    if (!user) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("User not found", false));
    }

    let reaction = await _Reaction.findOne({ postOrCommentId, userId });
    let updatePostOrComment = false;
    let postOrComment;

    if (reaction) {
      if (reaction.icon === icon) {
        postOrComment = isPost
          ? await _Post.findById(postOrCommentId)
          : await _Comment.findById(postOrCommentId);

        if (!postOrComment) {
          return res
            .status(400)
            .json(
              Utils.createErrorResponseModel(
                `${isPost ? "Post" : "Comment"} not found`,
                false
              )
            );
        }

        if (isPost) {
          postOrComment.TotalLike -= 1;
        } else {
          postOrComment.likes -= 1;
        }

        await _Reaction.findByIdAndDelete(reaction._id);
        updatePostOrComment = true;
      } else {
        reaction.icon = icon;
        await reaction.save();
        return res
          .status(200)
          .json(
            Utils.createResponseModel(200, "Update reaction successfully", true)
          );
      }
    } else {
      const newReaction = new _Reaction({
        postOrCommentId,
        userId,
        icon,
      });
      await newReaction.save();
    }

    if (!updatePostOrComment) {
      postOrComment = isPost
        ? await _Post.findById(postOrCommentId)
        : await _Comment.findById(postOrCommentId);

      if (!postOrComment) {
        return res
          .status(400)
          .json(
            Utils.createErrorResponseModel(
              `${isPost ? "Post" : "Comment"} not found`,
              false
            )
          );
      }

      if (isPost) {
        postOrComment.TotalLike += 1;
      } else {
        postOrComment.likes += 1;
      }

      await postOrComment.save();
    }

    return res.status(200).json(Utils.createSuccessResponseModel(0, true));
  } catch (error) {
    console.log("Error in ReactionController.createReaction: ", error.message);
    return res
      .status(500)
      .json(Utils.createErrorResponseModel(error.message, false));
  }
};

const GetReactionByUser = async (req, res) => {
  try {
    const { postOrCommentId, userId } = req.query;
    const reaction = await _Reaction.findOne({ postOrCommentId, userId });
    if (!reaction) {
      return res
        .status(200)
        .json(
          Utils.createResponseModel(
            200,
            "You have no reaction to this post!",
            ""
          )
        );
    }
    res
      .status(200)
      .json(
        Utils.createResponseModel(
          200,
          "You have reaction to this post!",
          reaction.icon
        )
      );
  } catch (error) {
    console.log(
      "Error in ReactionController.getReactionByUser: ",
      error.message
    );
    res.status(500).json(Utils.createErrorResponseModel(error.message, false));
  }
};

const GetAllReactions = async (req, res) => {
  try {
    //find all reactions of a post or a comment and get info user: name, avatar,fullName, email
    const { pageIndex, pageSize, postOrCommentId } = req.query;
    const query = _Reaction
      .find({ postOrCommentId })
      .populate("userId", "UserName Avatar FullName Email")
      .sort({ createdAt: -1 })
      .select("icon userId createdAt");
    const data = await query.skip((pageIndex - 1) * pageSize).limit(pageSize);
    const total = await _Reaction.countDocuments({ postOrCommentId });
    res.status(200).json(Utils.createSuccessResponseModel(total, data));
  } catch (error) {
    console.log("Error in ReactionController.getAllReactions: ", error.message);
    res.status(500).json(Utils.createErrorResponseModel(error.message, false));
  }
};

module.exports = {
  CreateReaction: CreateReaction,
  GetReactionByUser: GetReactionByUser,
  GetAllReactions: GetAllReactions,
};
