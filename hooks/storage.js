import { MMKV } from 'react-native-mmkv'
import { useId } from 'react';

export const storage = new MMKV();


// Retrieve array of all saved rides
export const getAllRides = () => {
    const allKeys = storage.getAllKeys();
    const allRides = [];

    for (key of allKeys){
        const serializedData = storage.getString(key);
        const parsedData = JSON.parse(serializedData);
        allRides.push(parsedData);
    }

    return allRides;
}

//Save new ride
export const saveRide = (rideFrom, rideTo, seats, price, date) => {
    const newRide = {
        from: rideFrom,
        to: rideTo,
        seatsTotal: seats,
        seatsTaken: 0,
        price: price,
        date: date,
        participants: []
    }
    const uniqueId = Date.now();
    storage.set(uniqueId, JSON.stringify(newRide));
}