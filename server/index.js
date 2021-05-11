const express=require('express');
const youtube=require('youtube-api');
const uuid=require('uuid').v4;
const cors=require('cors');
const open=require('open');
const multer=require('multer');
const fs=require('fs');
const app=express();
app.use(express.json());
const credentials=require('./music-credentials.json');
app.use(cors());
let ids="";
const status1={};
const storage=multer.diskStorage({
destination:'./',
filename(req,file,cb){
    const newFileName= `${uuid()}-${file.originalname}`
    cb(null,newFileName);

}
})
const uploadVideoFile=multer({
    storage:storage,
}).single("videoFile");

const oAuth=youtube.authenticate(
    {
        type:'oauth',
        client_id:credentials.web.client_id,
        client_secret:credentials.web.client_secret,
        redirect_url:credentials.web.redirect_uris[0]
    }
)
const updatestatus=(id,status,resid,next)=>{
    
    if(status==="done"){
        status1[id](id,"done",resid);
      
    }
    if(status==="processing"){
        status1[id]=next;
    }
}
app.post('/upload',uploadVideoFile,(req,res)=>{
    const {id}=req.body;
    

    console.log(id);

    if(req.file){
      
        const filename=req.file.filename;
        const {title,description}=req.body;
        open(oAuth.generateAuthUrl({
            access_type:'offline',
            scope:["https://www.googleapis.com/auth/youtube.upload"],
            state:JSON.stringify({filename,title,description,id})
        }))
    }
    updatestatus(id,"processing",0,(id,status,resid)=>{
     if(status==="done"){
         console.log("Video uploaded")
         res.json({status:resid,successcode:1,message:"success"});
     }   
     else if(status==="error"){
         res.json({status:resid,successcode:0,message:"Some problem retry."})
     }
    });
   
    
})
app.get('/Oauth2callback',(req,res)=>{
    console.log(req);
    // res.redirect("http://localhost:3000/success");
    const {filename,title,description,id}=JSON.parse(req.query.state);
    oAuth.getToken(req.query.code,(err,tokens)=>{
        if(err){
            console.log(err);
            return;
        }
        oAuth.setCredentials(tokens);
        youtube.videos.insert({
            resource:{
                snippet:{title,description},
                status:{privacyStatus:'private'}
            },
            part:'snippet,status',
            media:{
                body:fs.createReadStream(filename)
            }
        },(err,data)=>{
            console.log("done");
            if(err){
                console.log(err);
                console.log("error");
                updatestatus(id,"error",0,(id,status)=>{

                })
                res.redirect("http://localhost:3000/success/404");
            }
            else{
                
                updatestatus(id,"done",data.data.id,(id,status)=>{

                })
                     res.redirect("http://localhost:3000/success/"+data.data.id);
            
               
            }
            
            
            
            
        })
    })
})

const PORT=4000;


app.listen(4000,(req,res)=>{
    console.log("App is listening On port 4000");
})