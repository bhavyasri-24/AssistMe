import Comment from "../models/comment.models.js"
import Post from "../models/post.models.js"

export const handleAddComment = async(req, res)=>{
  const {content} = req.body;
  const postId = req.params.id;

  if (!content || content.trim()==="") return res.status(400).json({error: "comment content is required"});

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({error: "post not found"});

  try{
    const comment = await Comment.create({
      content : content.trim(), 
      user: req.userId,
      post: postId
    })

    post.commentsCount++;
    await post.save();
    
    await comment.populate("user", "username email");

    res.status(201).json({message: "comment added successfully", comment});
  }
  catch(error){
    res.status(500).json({error: error.message});
  }
}

export const handleGetComments = async(req, res)=>{
  const postId = req.params.id;

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({error: "post not found"});

  try{
    const comments = await Comment.find({post: postId}).populate("user", "username email").sort({createdAt: -1});

    res.status(200).json(comments);
  }
  catch(error){
    res.status(400).json({error: error.message});
  }
}

export const handleDeleteComment = async(req, res) => {
  try{
    const {id, commentId} = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({error: "comment not found"});

    if (comment.post.toString() !== id) return res.status(400).json({error:"comment does ot belong to this post"});

    if (comment.user.toString() !== userId) return res.status(403).json({error: "forbidden"});

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({error: "comment deleted"});
  }
  catch(error){
    return res.status(500).json({error: error.message});
  }
};

export const handleUpdateComment = async(req, res)=>{
  const {id, commentId} = req.params;
  const {content} = req.body;
  const userId = req.userId;

  try{
    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "content required" });
    }
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({error: "comment not found"});

    if (comment.post.toString() !== id) return res.status(400).json({error:"comment does ot belong to this post"});

    if (comment.user.toString() !== userId) return res.status(401).json({error: "unauthorized"});

    comment.content = content.trim();
    await comment.save();
    res.status(200).json({message: "comment updated"});
  }
  catch(error){
    return res.status(500).json({error: error.message});
  }
}

