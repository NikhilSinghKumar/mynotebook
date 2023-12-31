const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// Route 1: Get all the notes using: GET "/api/notes/getuser". login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
try{
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
} catch (error){                                                            
    console.error(error.message);
    res.status(500).send("internal server error.");
}
});

// Route 2: Add a new note using: POST "/api/notes/addnote". login required
router.post(
  "/addnote",
  fetchuser,
  [
    body('title', 'enter valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 chars').isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try{
    const { title, description, tag } = req.body;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Note({
      title,
      description,
      tag,
      user: req.user.id
    });

    const savedNote = await note.save()
    res.json(savedNote);
    } catch(error){
        console.error(error.message);
        res.status(500).send("internal server error.");
    }
});

<<<<<<< HEAD
// Route 3: Update an existing Note using: PUT "/api/notes/updatenote". login required
=======
// Route 3: Update an existing Note using: POST "/api/notes/updatenote". login required
>>>>>>> 97f341d639b2ba6d7f874f13f188c0c2cb215484
router.put(
  "/updatenote/:id", fetchuser, async (req, res) => {
    const {title, description, tag} = req.body;
    // create a newNote object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    // Find the note to be updted and update it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}
    if(note.user.toString() !== req.user.id){
      return res.status(401).send("Not Allowed")
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note})
  })

<<<<<<< HEAD
// Route 4: Delte an existing Note using: DELETE "/api/notes/deletenote". login required
router.delete(
  "/deletenote/:id", fetchuser, async (req, res) => {
    try{
    // Find the note to be delted and delete it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    // Allow deletion only if user owns this Note
    if(note.user.toString() !== req.user.id){
      return res.status(401).send("Not Allowed")
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success": "Note has been deleted.", note: note})
    } catch(error){
      console.error(error.message);
      res.status(500).send("internal server error.");
  }
})

module.exports = router;
=======
module.exports = router;


>>>>>>> 97f341d639b2ba6d7f874f13f188c0c2cb215484
