const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const hospitalSchema = new mongoose.Schema({
     user_type:{type:String, enum:["Admin"]},

      Normal_Room:{
        type:Number,
        default:50
      },
    Oxygen_Rooms:  {
        type:Number,
        default:50

    },
    ICU:{
        type:Number,
        default:20

    },
    flat_bed :{type:Number,default:80},
    normal_masks:{type:Number,default:200},
    oxygen_cylinders:{type:Number,default:110},
    recliner_bed:{type:Number,default:100},
    non_rebreather_masks:{type:Number,default:120},
    ventilator:{type:Number,default:10}

}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema)