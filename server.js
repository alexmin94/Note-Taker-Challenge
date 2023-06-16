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

app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read notes' });
      } else {
        const notes = JSON.parse(data);
        const newNote = req.body;
  
        // Assign a unique ID to the new note
        newNote.id = Date.now();
  
        // Add the new note to the array
        notes.push(newNote);
  
        // Write the updated notes array back to the file
        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), 'utf8', (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create note' });
          } else {
            res.status(201).json(newNote);
          }
        });
      }
    });
  });
  app.delete("/api/notes/:id",(req,res)=>{
    const noteId=parseInt(req.params.id)
    fs.readFile(path.join(__dirname,"db/db.json"),"utf8",(err,data)=>{
        if(err){
            console.error(err)
            res.status(500).json({error:"failed to read"})
        }else{
            const notes=JSON.parse(data)
            const noteIndex=notes.findIndex(note => note.id===noteId)
            if(noteIndex !== -1){
                notes.splice(noteIndex,1)
                fs.writeFile(path.join(__dirname,"db/db.json"),JSON.stringify(notes),"utf8",(err)=>{
                    if(err){
                        console.error(err)
                        res.status(500).json({error:"failed to delete"})

                    }else{
                        res.status(200).json({message:"deleted successfully"})
                    }
                })
            }else{
                res.status(404).json({error:"note not found"})
            }
        }
    })
  })

app.listen(PORT,()=>console.log(`listening on port ${PORT}`))

