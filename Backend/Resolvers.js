const Post = require('./models/Post');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret_key="Anil";
const checkAuth = require('./util/check-auth');

const resolvers = {
    Query: {
     getPosts() {
         return Post.find()
     },
     getPost({postId}) {
         const post= Post.findById(postId)
         if(post)
         {
             return post 
         }
         else
         {
             throw new Error("Wrong Id");
         }
     }
    },
    Mutation: {
        async createComment(_,{postId,body})
        {
           if(body.trim === ''){
               throw new Error("Cannot send empty comment")
           }
           const post = await Post.findById(postId);
           if(post) {
              post.comments.unshift({
                  body,
                  username:post.username,
                  createdAt: new Date().toISOString()
              })
               await post.save();
               return post;
           }
           else {
               throw new Error("Post not found")
           }
        },

        async deleteComment(_,{postId,commentId},context) {
            const { username } = checkAuth(context);
            const post = await Post.findById(postId);
           if(post) {
              const commentIndex = post.comments.findIndex(c=> c.id ===commentId);
              
              if(post.comments[commentIndex].username===username) {
                  post.comments.splice(commentIndex,1);
                  await post.save();
                  return post;

              }
              else {
                  throw new Error("Action not aloowed")
              }
           }
           else {
               throw new Error("Post not found")
           }
        },

        async likePost (_,{postId},context) {
            const { username } = checkAuth(context);
            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find(like => like.username === username)){
                    post.likes = post.likes.filter(like => like.username !== username);

                }
                else {
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save();
                return post;
            }
            else {
                throw new Error("Post not found")
            }
        },


        async createPost(_,{body},context)
        {
            const user = checkAuth(context);
           const newPost =new Post({
               body,
               user:user.id,
               username:user.username,
               createdAt:new Date().toISOString()
           })
           const post= await newPost.save();
           return post;
        },
        
        async deletePost(_,{postId},context){
            try {
                const user = checkAuth(context);
                const post =await Post.findById(postId);
                if(user.username === post.username) {
                    await post.delete();
                    return "Post Deleted Succesfully"
                }
                else {
                    throw new Error("Action not allowed")
                }
            }
            catch(err) {
                throw new Error(err)
            }
        },
        async login(_,{username,password}) {
            const user = await User.findOne({username});
            if(!user) {
                throw new Error("User not present");  
            }
            const match = await bcrypt.compare(password,user.password);
            if(!match) {
                throw new Error("Incorrect password")
            }

            const token = jwt.sign({
                id:user.id,
                email:user.email,
                username:user.username
            },secret_key,{expiresIn:'1h'});
     
            return{
                ...user._doc,
             id:user.id,
             token
            }

        },
     async register(parent, {registerInput:{
         username,password,confirmPassword,email
     }}) {
         const user= await User.findOne({username});
         if(user) {
               console.error("User already present")
         }
       password = await bcrypt.hash(password,12)
       const newUser =new User({
           email,
           username,
           password,
           createdAt:new Date().toISOString()
       });

       const res = await newUser.save();

       const token = jwt.sign({
           id:res.id,
           email:res.email,
           username:res.username
       },secret_key,{expiresIn:'1h'});

       return{
           ...res._doc,
        id:res.id,
        token
       }
     }
    }
}
module.exports = resolvers;