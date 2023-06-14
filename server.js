const express=require("express")
const path=require("path")
const fs=require("fs")
const app=express()
const PORT=process.env.PORT||3002
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))


app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"))
})
app.get("/notes",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","notes.html"))
})
app.get("/api/notes",(req,res)=>{
    fs.readFile(path.join(__dirname,"db/db.json"),"utf8",(error,data)=>{
if(error){
    console.error(error)
    res.status(500).json({error:"cannot read note"})
} else{
    const notes=JSON.parse(data)
    res.json(notes)
}
    })
})


app.listen(PORT,()=>console.log(`listening on port ${PORT}`))