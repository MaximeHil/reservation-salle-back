const path = require('path');
const Reservation = require('../models/reservation')
const fs = require('fs');

exports.getAllRooms = (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, './', 'rooms.json'));
}

exports.getRoomsWithName = (req, res, next) => {
    let jsonRooms = JSON.parse(fs.readFileSync(`${__dirname}/rooms.json`, 'utf-8'));
    console.log(req.params);
    let filteredRooms = jsonRooms.rooms.filter(room => room.name.toLocaleLowerCase().includes(req.params.filter.toLowerCase()));

    if(filteredRooms && filteredRooms.length > 0){
        res.status(200).json({ rooms: filteredRooms});
    }else {
        res.status(200).json({rooms: [], message: "Aucune salle ne correspond"})
    }

}

exports.getRoomsWithEquipement = (req, res, next) => {
    let jsonRooms = JSON.parse(fs.readFileSync(`${__dirname}/rooms.json`, 'utf-8'));

    if(!req.params.filter){
        console.log("Pas de mot pour filtrer")
        res.status(400).json({ message: "Pas de filtre donné"});
    } else {
        let test;
        let filteredRooms = jsonRooms.rooms.filter(
            room => {
                test = room.equipements.filter(
                    equipement => equipement.name.toLowerCase().includes(req.params.filter.toLowerCase())
                )
                if(test && test.length>0){
                    return room;
                }
            }
        )

        console.log(filteredRooms);

        if(filteredRooms && filteredRooms.length > 0){
            res.status(200).json({ rooms: filteredRooms});
        }else {
            res.status(200).json({rooms: [], message: "Aucune salle ne correspond"})
        }
    }
}

exports.getRoomsWithCapacity = (req, res, next) => {
    let jsonRooms = JSON.parse(fs.readFileSync(`${__dirname}/rooms.json`, 'utf-8'));
    console.log(req.params);

    if(isNaN(req.params.filter)){
        res.status(400).json({ message: "La capacité de la salle doit être un nombre",rooms: []});
        return;
    }

    if(req.params.filter < 0){
        res.status(400).json({ message: "La capacité de la salle doit être positive",rooms: []});
        return;
    }

    let filteredRooms = jsonRooms.rooms.filter(room => room.capacity >= req.params.filter);

    if(filteredRooms && filteredRooms.length > 0){
        res.status(200).json({ rooms: filteredRooms});
    }else {
        res.status(200).json({rooms: [], message: "Aucune salle ne correspond"})
    }

}

exports.bookRoom = (req, res, next) => {
    console.log(req.body);
    const reservObject = req.body.reservation;
    // Checking if the body of the request isn't empty
    if (!reservObject){
        console.log("Première condition \n");
        res.status(400).json({ message: "Le corps de la requête est vide !"});
        return;
    }
    // Checking if the begin date is before the end date
    if(reservObject.begin > reservObject.end){
        console.log("Deuxième condition \n");
        res.status(401).json({ message: "La date de début doit être antérieure à la date fin !"});
        return;
    }

    // Checking if the room is already booked for the given date
    let alreadyBooked = false;
    Reservation.find({ roomName: reservObject.roomName })
        .then(reservs => {
            if(reservs){
                for(const reserv of reservs){
                    // Dates need to be converted from String type to Date type
                    if(!(new Date(reservObject.end) < new Date(reserv.begin) || new Date(reservObject.begin) > new Date(reserv.end)) ){
                        res.status(400).json({ message: "La salle n'est pas disponible pour ces horaires !"});
                        alreadyBooked = true;
                    }
                }
                // If the room is not booked for the given date, the reservation is saved
                if(!alreadyBooked){
                    delete reservObject._id;
                    const reservation = new Reservation({
                        ...reservObject
                    });
                    reservation.save()
                        .then(() => res.status(201).json({ message: 'Réservation enregistrée !'}))
                        .catch((error) => res.status(403).json({ error }));
                }
            }
        }).catch((error) => console.log(error))
}
