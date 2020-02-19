const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, lowercase: true, default: '' },
    email: { type: String, lowercase: true, unique: true, default: '' },
    password: { type: String, default: '' }
});

module.exports = mongoose.model('user', UserSchema);
