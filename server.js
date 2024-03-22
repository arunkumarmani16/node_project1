let express= require("express")
let dotenv=require("dotenv").config()
let fs= require("fs")
let path=require("path")
let app=express()


//middleware of env
console.log(dotenv);
//Middleware of reqbody
app.use(express.json())
app.use((err,req,res,next)=>{
    if(err)
    {
        res.status(500).send({message:"Somthing wrong !",success:false})
    }
    else{
        next()
    }
})

//Middleware of Static
app.use(express.static("views"))
//middllware ejs
app.set("view engine","ejs")
let port=process.env.PORT
console.log(port)

app.get("/",async(req,res)=>{
    res.render("pages/index")
})
app.get("/offer",async(req,res)=>{
    res.render("pages/offer")
})
app.get("/admin",async(req,res)=>{
    try{
        res.render('pages/admin')
    }
    catch(err)
    {
         res.send("something is wrong")
    }
})
app.post("/admin",async(req,res)=>{
   try {
    let {id,name,qul,phone,course}=req.body
    if (!id || !name || !qul || !phone || !course){
        return res
        .status(400)
        .send({message:"All field is required*",
               success:false
    })
    }
    else
{
       fs.readFile(path.join(__dirname,"db/db.json"),"utf-8",(err,data)=>{
        if(err){
            throw new Error(err.message)
        }
        else{
            let originalData=JSON.parse(data)

            originalData.push({...req.body})
            fs.writeFile(path.join(__dirname,"db/db.json"),JSON.stringify(originalData),(err)=>{
                if(err){
                    throw new Error(err.message)               
                 }
                else{
                    res.send(originalData)
                }
            })
        }
       })
}
   } catch (err) {
    throw new Error(err.message)
   }

 })
 app.get("/faculty",(req,res)=>{
    try {
        fs.readFile(path.join(__dirname,"db/db.json"),"utf-8",(err,data)=>{
            if(err){
                throw new Error(err.message)
            }
            else{
                let originalData=JSON.parse(data)
                res.render("pages/faculty",{
                    title:"All Faculty Details",
                    data:originalData,
                })
            }
        })

    } catch (err) {
      throw new Error(err.message)  
    }
 })
 app.delete("/faculty/:id",(req,res)=>{
   let {id}=req.params
   fs.readFile(path.join(__dirname,'db/db.json'),"utf-8",(err,data)=>{
    if(err){
        throw new Error(err.message)
    }
    else{
        let originalData=JSON.parse(data)
        originalData=originalData.filter((item)=>{
            return item.id !=id
        })
        fs.writeFile(path.join(__dirname,"db/db.json"),JSON.stringify(originalData),(err)=>{
            if(err){
                throw new Error(err.message)
            }
            else(
                res.status(200).send({ok:true})
            )
        })
    }
   })
 })
app.listen(port,()=>{
    console.log(`Server is connected at http://localhost:${port}`);
})