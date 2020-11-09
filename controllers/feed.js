const UserData = require('../models/user');
exports.getbus = (req, res, next) => {

    UserData.fetchAll().then(result => {
        res.status(200).json({
            posts: result
        });
    })
};
exports.displayingdetails = (req, res, next) => {

    var bus = {
        id: req.body.id,
        From: req.body.From,
        To: req.body.To,
        Pickup: new Date(req.body.Pickup_Date + " " + req.body.Pickup_Time),
        Drop: new Date(req.body.Drop_Date + " " + req.body.Drop_Time),
        Economy_Cost: req.body.Economy_Cost,
        FirstClass_Cost: req.body.FirstClass_Cost
    };

    UserData.fetchseats(bus)
        .then(result => {

            let val = result;
            let i;
            let bookseat = [];

            for (i = 0; i < val.length; i++) {
                bookseat.push(val[i].seat);
            }
            if (i == val.length) {
                return {
                    PassengersDetails: result,
                    Seatsbooked: bookseat
                };
            }

        }).then(result => {
            // console.log(result);
            let unbookedseat = [];
            let val = result.Seatsbooked;
            let i = 1;
            // console.log(val);

            for (i = 1; i <= 40; i++) {
                if (!val.includes(i + "")) {
                    unbookedseat.push(i + "");
                }
            }
            if (i > 40) {
                result.Unbookedseat = unbookedseat;
                return result;
            }
        }).then(result => {
            res.status(200).json({
                data: result
            });
        })


}
exports.addbus = (req, res, next) => {

    const BusName = req.body.BusName;
    const BusNumber = req.body.BusNumber;
    const Seats = req.body.Seats;
    var bus = {

        BusName: BusName,
        BusNumber: BusNumber,
        Seats: Seats,
        Trips: []
    };

    var data = new UserData(bus);

    UserData.buscheck(bus).then(result=>{
        
        if( result.length == 0 ){
            data.save().then(result => res.status(200).json({
                msg: "Bus Details inserted successfully!!!"
            }))
        }
        else{
            res.status(400).json({
                msg: "Bus Details Already Exist!!!"
            })
        }
    }).catch(err => res.status(400).json({
        err: err
    }));
};

exports.deletePost = (req, res, next) => {

    const BusCompanyName = req.body.id;

    UserData.remove(BusCompanyName).then(result => res.status(200).json({
        msg: "deleted successfully!!!"
    })).catch(err => res.status(200).json({
        err: err
    }));
};
exports.addtrips = (req, res, next) => {

    const id = req.body.id;
    const From = req.body.From;
    const To = req.body.To;
    const Pickup = new Date(req.body.Pickup_Date + " " + req.body.Pickup_Time);
    const Drop = new Date(req.body.Drop_Date + " " + req.body.Drop_Time);
    const Economy_Cost = req.body.Economy_Cost;
    const FirstClass_Cost = req.body.FirstClass_Cost;
    console.log(req.body.Pickup_Date + " " + req.body.Pickup_Time + " " + Pickup);
    console.log(req.body.Drop_Date + " " + req.body.Drop_Time + " " + Drop);

    var bus = {
        From: From,
        To: To,
        Pickup: new Date(Pickup),
        Drop: new Date(Drop),
        Booked_Seats: [],
        Economy_Cost: Economy_Cost,
        FirstClass_Cost: FirstClass_Cost
    };

    console.log(bus);

    UserData.tripcheck(id, bus).then(result => {
        if (result.length == 0) {

            UserData.updatetrips(id, bus).then(result => res.status(200).json({
                msg: "Trip Added successfully!!!"
            })).catch(err => res.status(400).json({
                err: err
            }));
        } else {
            res.status(400).json({
                msg: "Aldready Trip Exist"
            })
        }
    }).catch(err => res.status(400).json({
        err: err
    }));
}

exports.addseats = (req, res, next) => {

    const id = req.body.id;
    const From = req.body.From;
    const To = req.body.To;
    const Pickup = new Date(req.body.Pickup_Date + " " + req.body.Pickup_Time);
    const Drop = new Date(req.body.Drop_Date + " " + req.body.Drop_Time);
    const Economy_Cost = req.body.Economy_Cost;
    const FirstClass_Cost = req.body.FirstClass_Cost;

    var bus = {
        id: id,
        From: From,
        To: To,
        Pickup: new Date(Pickup),
        Drop: new Date(Drop),
        Booked_Seats: [],
        Economy_Cost: Economy_Cost,
        FirstClass_Cost: FirstClass_Cost
    };
    console.log(req.body);


  

    return new Promise(function (resolve, reject) {

        let i = 1;
        var books = [];

        while (req.body["name" + i] != undefined) {
            let data = {
                Account: req.body["Account"],
                Name: req.body["Name" + i],
                Age: req.body["Age" + i],
                Phone: req.body["Phone" + i],
                Seat: req.body["Seat" + i]
            }
            books.push(data);
            i++;
        }

        if (req.body["name" + i] == undefined)
            return resolve(books);
    }).then(result => {
        return UserData.updateseats(bus, result);
    }).then(result => {

        return res.status(200).json({
            msg: "Seats Updated successfully!!!"
        });
    }).catch(err => res.status(400).json({
        err: err
    }));
}









                                                       
// "_id" : "aksudyausdajsdg",                          
// "Name" : "KPN Travels",                             
// "Number" : "TN37AY0987",                            
// "Seats" : 40,                                       
// "Trips" : [                                         
//     "1" : {
//         "From" : "Coimbator",
//         "To" : "Chennai",
//         "Pickup_Date" : "10/03/2021",
//         "Drop_Date" : "11/3/2021",
//         "Pickup_Time" : "10:00 PM",
//         "Drop_Time" : "10:00 PM",
//         "Booked_Seats" [
//             "1" : {
//                 "Name" : "BB",
//                 "Age" : 20,
//                 "Seat_No" : "2_1",
//                 "Phone Number" : 0987654321
//             },
//             "2" : {
//                 "Name" : "DD",
//                 "Age" : 21,
//                 "Seat_No" : "2_2",
//                 "Phone Number" : 1234567890
//             }
//         ],
//         "Economy_Cost" : "$70",
//         "FirstClass_Cost" : "$100"
//     },
//     "2" : {
//         "From" : "Chennai",
//         "To" : "Coimbatore",
//         "Pickup_Date" : "10/04/2021",
//         "Drop_Date" : "11/4/2021",
//         "Pickup_Time" : "10:00 PM",
//         "Drop_Time" : "10:00 PM",
//         "Booked_Seats" [
//             "1" : {
//                 "Name" : "BB",
//                 "Age" : 20,
//                 "Seat_No" : "2_1",
//                 "Phone Number" : 0987654321
//             },
//             "2" : {
//                 "Name" : "DD",
//                 "Age" : 21,
//                 "Seat_No" : "2_2",
//                 "Phone Number" : 1234567890
//             }
//         ],
//         "Economy_Cost" : "$70",
//         "FirstClass_Cost" : "$100"
//     }
// ]