const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const hospitalSchema = new mongoose.Schema({

     //userId: {type: ObjectId,ref: 'User',required: true},
    user_type:{type:String, enum:["Patient"]},
    roomsType: { type:String, enum:["Normal_Room","Oxygen_Rooms","ICU"]},
    flat_bed :{type:Number},
    normal_masks:{type:Number},
    oxygen_cylinders:{type:Number},
    recliner_bed:{type:Number},
    non_rebreather_masks:{type:Number},
    ventilator:{type:Number}

}, { timestamps: true });

module.exports = mongoose.model('Room', hospitalSchema)


