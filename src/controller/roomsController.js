const roomsModel = require("../Models/roomsModel");
const validator = require("../validator/validator")
const availabilityModel = require("../Models/availability");


const roombook = async (req, res) => {
    try {

        const { request } = req.body;

        if (!validator.isValidBody(req.body)) {
            return res
                .status(400)
                .send({ status: false, message: "ERROR! : request body is empty" });
        }

        const remaining = await availabilityModel.findOne({ user_type:"Admin"})
        const patient = {}

        if (request == "Normal_Room") {

            patient.roomsType = request
            console.log(patient.roomsType);
            patient.user_type="Patient"
            // Requires: 1 flat bed + 2 normal masks.
            if (remaining.Normal_Room >= 1 && remaining.flat_bed >= 1 && remaining.normal_masks >= 2) {
                patient.flat_bed = 1;
                patient.normal_masks = 2;
                remaining.flat_bed--,
                    remaining.normal_masks = remaining.normal_masks - 2;
                remaining.Normal_Room--;
                const Remaining_availability = {
                    Normal_Room: remaining.Normal_Room,
                    Oxygen_Rooms: remaining.Oxygen_Rooms,
                    ICU: remaining.ICU,

                }
                const updatedrooms = await availabilityModel.findOneAndUpdate({ user_type: "Admin" }, remaining, { new: true })
                await roomsModel.create(patient);
                return res.status(201).send({
                    status: true, msg: "01 Normal room (with 1 flat bed + 1 normal masks) reserved",
                    Remaining_availability: Remaining_availability
                })
            } else {
                const Remaining_availability = {
                    Normal_Room: `NA`,
                    Oxygen_Rooms: `${remaining.Oxygen_Rooms} (depending upon resources allocated)`,
                    ICU: `${remaining.ICU} (depending upon resources allocated)`,

                }

                return res.status(400).send({
                    status: false, msg: "Sorry, no rooms could be reserved.",
                    Remaining_availability: Remaining_availability
                })


            }


        } else if (request == "Oxygen_Rooms") {


            patient.roomsType = request
            // Requires: 2 oxygen cylinders + 1 recliner bed + 2 non rebreather masks
            if (remaining.Oxygen_Rooms >= 1 && remaining.recliner_bed >= 1 && remaining.oxygen_cylinders >= 2 && remaining.non_rebreather_masks >= 2) {
                patient.recliner_bed = 1;
                patient.oxygen_cylinders = 2;
                patient.non_rebreather_masks = 2;

                remaining.recliner_bed--,
                    remaining.oxygen_cylinders = remaining.oxygen_cylinders - 2;
                remaining.non_rebreather_masks = remaining.non_rebreather_masks - 2;
                remaining.Oxygen_Rooms--;

                const Remaining_availability = {
                    Normal_Room: remaining.Normal_Room,
                    Oxygen_Rooms: remaining.Oxygen_Rooms,
                    ICU: remaining.ICU,

                }
                const updatedrooms = await availabilityModel.findOneAndUpdate({ user_type: "Admin" }, remaining, { new: true })
                await roomsModel.create( patient );
                return res.status(201).send({
                    status: true, msg: "01 Oxygen room (with 2 non rebreather masks + 2 oxygen cylinder + 1 recliner bed) reserved",
                    Remaining_availability: Remaining_availability
                })
            } else {
                const Remaining_availability = {
                    Normal_Room: `${remaining.Normal_Room} (depending upon resources allocated)`,
                    Oxygen_Rooms: `NA`,
                    ICU: `${remaining.ICU} (depending upon resources allocated)`,

                }

                return res.status(400).send({
                    status: false, msg: "Sorry, no rooms could be reserved.",
                    Remaining_availability: Remaining_availability
                })


            }
       } else if (request == "ICU") {


            patient.roomsType = request
            // Requires: 1 ventilator + 1 recliner bed + 1 oxygen cylinder

            if (remaining.ICU >= 1 && remaining.recliner_bed >= 1 && remaining.oxygen_cylinders >= 1 && remaining.ventilator >= 1) {
                patient.recliner_bed = 1;
                patient.oxygen_cylinders = 1;
                patient.ventilator = 1;

                remaining.recliner_bed--,
                    remaining.oxygen_cylinders--; // = remaining.oxygen_cylinders - 2;
                remaining.non_rebreather_masks--; // = remaining.non_rebreather_masks - 2;
                remaining.ICU--;

                const Remaining_availability = {
                    Normal_Room: remaining.Normal_Room,
                    Oxygen_Rooms: remaining.Oxygen_Rooms,
                    ICU: remaining.ICU,

                }
                const updatedrooms = await availabilityModel.findOneAndUpdate({ user_type: "Admin" }, remaining, { new: true })
                await roomsModel.create( patient );
                return res.status(201).send({
                    status: true, msg: "01 ICU room (with 1 ventilator + 1 oxygen cylinder + 1 recliner bed) reserved",
                    Remaining_availability: Remaining_availability
                })
            } else {
                const Remaining_availability = {
                    Normal_Room: `${remaining.Normal_Room} (depending upon resources allocated)`,
                    Oxygen_Rooms: `${remaining.Oxygen_Rooms} (depending upon resources allocated)`,
                    ICU: `NA`,

                }

                return res.status(400).send({
                    status: false, msg: "Sorry, no rooms could be reserved.",
                    Remaining_availability: Remaining_availability
                })
            }
        }

    } catch (error) {

        console.log(error)
        return res.status(500).send({ status: true, error: error })
    }
}




const updateresources = async (req, res) => {

    try {

        const { user_type } = req.body;

        if (user_type === "Admin") {

            const rooms = await availabilityModel.findOne({ user_type: "Admin" })
            if (!rooms) {

                const newrooms = await availabilityModel.create(req.body)
                return res.status(201).send({ status: true, msg: newrooms })



            } else {

                const updatedrooms = await availabilityModel.findOneAndUpdate({ user_type: "Admin" }, req.body, { new: true })
                return res.status(200).send({ status: true, msg: updatedrooms })


            }
            //     const updatedrooms = await availabilityModel.findOneAndUpdate({user_type:"Admin"},req.body,{new:true})
            //     return res.status(200).send({status:true, msg:updatedrooms})
            //
        } else {
            return res.status(401).send({ status: false, msg: "you don't have authority" })


        }


    } catch (error) {

    }


}



module.exports.roombook = roombook
module.exports.updateresources = updateresources





























// const Normal_Room = 50 ;
// const Oxygen_Rooms = 50 ;
// const ICU = 20 ;


// Requires: 1 flat bed + 2 normal masks.
// Requires: 2 oxygen cylinders + 1 recliner bed + 2 non rebreather masks
// Requires: 1 ventilator + 1 recliner bed + 1 oxygen cylinder

// The availability of different resources is as follows:

// Beds: ==>

// const  Flat Beds = 80
// const Recliner Beds = 100
// Equipments:==>

// Type Qty
// Ventilator 16
// Oxygen Cylinder 110
// Normal Masks 200
// Non rebreather masks 120















