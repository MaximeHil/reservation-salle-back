const express = require('express');

const router = express.Router();
const roomsCtrl = require('../controllers/rooms');

router.post('/filter', roomsCtrl.getRoomsFiltered);
router.post('/reservations', roomsCtrl.getReservationsForRoom);
router.post('/reservation', roomsCtrl.bookRoom);
router.get('/name/:filter', roomsCtrl.getRoomsWithName);
router.get('/equipement/:filter', roomsCtrl.getRoomsWithEquipement);
router.get('/capacity/:filter', roomsCtrl.getRoomsWithCapacity);
router.get('/', roomsCtrl.getAllRooms);


module.exports = router;
