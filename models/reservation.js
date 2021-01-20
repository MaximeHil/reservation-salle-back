const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    roomName: { type: String, required: true },
    begin: { type: Date, required: true },
    end: { type: Date, required: true}
});

module.exports = mongoose.model('Reservation', reservationSchema);
