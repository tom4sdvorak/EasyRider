import AsyncStorage from '@react-native-async-storage/async-storage';

interface RideData {
    from: string,
    to: string,
    seatsTotal: number,
    seatsTaken: number,
    price: number,
    date: Date,
    participants: []
}

interface Ride {
    id: string;
    rideData: RideData,
}

// Retrieve array of all saved rides
export const getAllRides = async (cityFrom?:string, cityTo?:string) : Promise<Ride[]> => { 
    try {
        const allKeys = await AsyncStorage.getAllKeys();
        const allRides = await AsyncStorage.multiGet(allKeys);
        let allRidesParsed: Ride[] = [];
        for (const item of allRides){
            if (item != null){ // Skip if null
                if(typeof item[0] === 'string' && typeof item[1] === 'string'){ // Skip if not saved as string so typescript understands
                    let ride = JSON.parse(item[1]); // Get the object that was saved as string in json object
                    ride.date = new Date(ride.date); // Resave the date string as Date object
                    if(ride.date.getTime() > Date.now()){ // Skip rides that expired
                        if(typeof cityFrom === 'undefined' && typeof cityTo === 'undefined'){ // Proceed if we want unfiltered rides
                            allRidesParsed.push({id: item[0], rideData: ride});
                        }
                        else if(typeof cityFrom != 'undefined' && typeof cityTo != 'undefined'){ // Proceed if we filter both cities
                            if(cityFrom === ride.from && cityTo === ride.to){
                                allRidesParsed.push({id: item[0], rideData: ride});
                            }
                        }
                        else{ // Proceed if we filter just one city
                            if(typeof cityFrom === 'undefined' && cityTo === ride.to){
                                allRidesParsed.push({id: item[0], rideData: ride});
                            }
                            else if(cityFrom === ride.from){
                                allRidesParsed.push({id: item[0], rideData: ride});
                            }
                        }
                        
                    }              
                }          
            }  
        }
        return allRidesParsed;
    } catch(e) {
        console.log(e);
        throw e;
    }
}

//Save new ride
export const saveRide = async (rideToSave: RideData) => {
    const uniqueId = Date.now();
    try {
        await AsyncStorage.setItem(uniqueId.toString(), JSON.stringify(rideToSave));
      } catch (e) {
        console.log(e);
    } finally {
        console.log("Saved ride: " + uniqueId);
        return true;
    }
}

//Get leaving soon rides
export const getEndingSoonRides = async () => {
    const allRides = await getAllRides();
    allRides.sort((a, b) => a.rideData.date.getTime() - b.rideData.date.getTime());
    return allRides;
}

//Get recently added rides
export const getRecentlyAddedRides = async () => {
    const allRides = await getAllRides();
    allRides.sort((a, b) => Number(b.id) - Number(a.id));
    return allRides;
}

export const getRideById = async(id: string):Promise<RideData> => {
    try {
        const ride = await AsyncStorage.getItem(id);
        if (ride != null){
            let newRide:RideData = JSON.parse(ride);
            newRide.date = new Date(newRide.date);
            return Promise.resolve(newRide);
        }
        else{
            return Promise.reject(new Error("Ride not found"));
        }
    }
    catch (e){
        console.log(e);
        throw e;
    }
    
}