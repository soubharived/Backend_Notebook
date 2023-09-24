const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator')


// Route 1 : get all the notes : get "/api/notes/fetchallnotes". Login required 
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    // fatch all notes of user by finding with user id 
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error ocured")
    }

})

// Route 2 : Add a new notes using: post "/api/notes/addnote". Login required 
router.post('/addnote', fetchuser, [
    body('title', "enter a valid title").isLength({ min: 1}),
    body('description', "description must atleast 1 characters").isLength({ min: 1 }),
], async (req, res) => {
    try {
        const { title, description, tag, } = req.body;

        // If there are errors return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id

        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error ocured")
    }

})

//Route 3 : Update existing notes using: Put"/api/notes/updatenote". Login required 
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;
    try {
        //create a newNote object
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag };

        // find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("note found") };
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error ocured")
    }
})

//Route 4 : Delete existing notes using: Delete "/api/notes/deletenote". Login required 
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        // find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("note found") };

        // Allow deletion only if user own this notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "note has been deleted", note: note });
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error ocured")
    }


})


module.exports = router