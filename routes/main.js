const express =require('express');
const router = express.Router();
const Post = require('../server/models/post')


router.get('', async (req,res) =>{

    try{
        const local ={
            title:'Nodejs Blog',
            des:'just noting'
        }
        
     let perPage =6;
     let page =req.query.page || 1;

     const data =await  Post.aggregate([{ $sort :{ createdAt :-1}}])
     .skip(perPage * page - perPage)
     .limit(perPage)
     .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page)+1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage)

    res.render('index', {
        local,
        data,
        current :page,
        nextPage: hasNextPage ? nextPage :null
    })
    }catch(error){
  console.error('Error', error)
    }
   
});


router.get('/post/:id',async (req,res)=>{
    try{
       
        
        let slug = req.params.id;
     
        const data = await Post.findById({ _id: slug})
        const local ={
            title: data.title,
            des:'just noting'
        }
        res.render('post',{local,data})
    }catch(error){
     console.error(error)
    }
})


router.post('/search', async (req,res)=>{
    
    try{
        const local ={
            title:'Nodejs Blog',
            des:'just noting'
        }
     
    let searchTerm = req.body.searchTerm;
         const searchNoSpecialchar =  searchTerm.replace(/[^a-zA-Z0-9 ]/g,"")

        const data = await Post.find({
            $or:[
                {
                    title:{$regex :new RegExp(searchNoSpecialchar,'i')}
                },
                {
                    bosy:{$regex :new RegExp(searchNoSpecialchar,'i')}
                }
            ]
        });
        res.render('search',{local,data})
    }catch(error){

    }
})

router.get('/about',(req,res) =>{
    const local ={
        title:'Nodejs Blog',
        des:'just noting'
    }
    
   
    res.render('about',{local})
})





module.exports = router;


