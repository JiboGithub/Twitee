const router = require('express').Router()
const passport = require('passport')
const Post = require('../models/Post')
const conn = require('../config/sqlconnection')


router.route('/add')
	.post(
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			const text = req.body.text

			let newPost = new Post();
			newPost = {
				
				userId:  req.user[0].UserId,
				userName: req.user[0].Name,
				createdAt: Date.now().toLocaleString(),
				text: text
			}

			var sql = `INSERT INTO posts (UserId, PostContent, DatePosted, TimePosted) 
			values(?,?,?,?)`;
			conn.query(sql, [newPost.userId, newPost.text.toString(), 
				Date.now(), (new Date().toLocaleTimeString())],
				(error, post, fields) => {
				if(error){
					return res.status(404).json(error)
				}
				if(post.affectedRows > 0){
					return res.status(200)
					.json({status: "success", message: post.message="Post Tweeted"})
				}
				return res.status(404).json("Tweet not published")
			})
})


router.route('/')
		.get((req, res) => {
			conn.query('SELECT posts.PostId as postId, posts.UserId as userId, \
			 users.Name as userName, posts.PostContent as tweet, \
			 posts.DatePosted as datePosted, posts.TimePosted as timePosted \
			 FROM posts LEFT JOIN users on posts.UserId = users.UserId \
			 ORDER BY posts.TimePosted DESC', (error, rows, fields) => {
				res.send(rows);
			})
})


router.route('/:userId')
	.get((req, res) => {
		const postOwnerId = req.params.userId;

		conn.query(`SELECT posts.PostId as postId, posts.UserId as userId, \
		users.Name as userName, posts.PostContent as tweet, \
		posts.DatePosted as createdAt, posts.TimePosted as timePosted \
		FROM posts LEFT JOIN users on posts.UserId = users.UserId \
		LEFT OUTER JOIN comments on posts.PostId = comments.PostId \
		where posts.UserId = ? ORDER BY posts.TimePosted DESC`, [postOwnerId], (error, rows, fields) => {
		res.send(rows);
	})
})


router.route('/delete/:postId')
.post(
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const postOwnerId = req.user[0].UserId;
		const postId = req.params.postId;

		if(postOwnerId){
			conn.query(`DELETE FROM posts WHERE PostId = ? and UserId = ?`, 
			[postId, postOwnerId], 
			(error, post, fields) => {
				if(post.affectedRows > 0){
					return res.status(200).json({ msg: 'Tweet Sucessfully Deleted'})
				} else {
					return res.status(404).json({ msg: 'You cannot delete other users tweet'})
				}
			})
		} else {
			return res.status(500).json({ msg: 'You do not have access to delete post'})
		}
		
})


router.route('/like/:postId')
.post(
	passport.authenticate('jwt', { session: false }),
	(req, res) => { const liker = req.user[0].UserId; const postId = req.params.postId;
		
	if(liker){ var sql = `INSERT INTO likes (LikedBy, PostId) values(?,?)`;
	conn.query(sql, [liker, postId], (error, post, fields) => {
		if(post.affectedRows > 0){ conn.query( `UPDATE posts SET Likes = (Likes + 1) where PostId = ${postId}`,
		(error, post, fields) => {
			if(post.affectedRows > 0){
				return res.status(200).json({ msg: 'You like this post'})
			} else {
				return res.status(404).json({ msg: 'Like was not updated'})}
			})
		} else {
		return res.status(500).json({ msg: 'Unable to like post'})}
	})
	} else {
		return res.status(500).json({ msg: 'You do not have access to like post'})}
})
			

router.route('/comment')
.post(
	passport.authenticate('jwt', { session: false }),
	(req, res) => { const commenter = req.user[0].UserId; 

		const newComment = req.body.comment;
		const postId = req.body.postId;

		console.log(commenter, newComment, postId)
		
		if(commenter && postId)
		{ 
			var sql = `INSERT INTO comments (CommentedBy, Comment, PostId) values(?,?,?)`;
			conn.query(sql, [commenter, newComment, postId], (error, post, fields) => {
				console.log(post)
				if(post.affectedRows > 0){
					return res.status(200).json({ msg: 'Comment successfully added to this post'})
				} else {
					return res.status(404).json({ msg: 'Comment was not published'})}
				})
			} else {
		return res.status(500).json({ msg: 'You cannot comment on this post'})}
})
	


module.exports = router