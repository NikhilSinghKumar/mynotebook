const mongoose = require('mongoose');
const Schema = require('Schema')

const NotesSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
        unique: true
    },
    tag:{
        type: String,
        default: 'General'
    },
    date:{
        type: String,
        default: Date.now
    }
  });

module.exports = mongoose.model('notes', NotesSchema)