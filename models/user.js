const getdb = require('../utils/database').getDb;
const mongodb = require('mongodb');
const {
    mongo
} = require('mongoose');

class User {
    constructor(n) {
        this.n = n;
    }
    save() {
        const db = getdb();
        return db.collection('user')
            .insertOne(this.n)
            .then((result) => {
                console.log(result.result.nModified);
            }).catch((err) => {
                console.log(err);
            });
    }

    static buscheck(validate) {
        const db = getdb();
        return db.collection('user')
            .find({
                "BusName": validate.BusName,
                "BusNumber": validate.BusNumber
            }).toArray()
            .then((result) => {
                return result;
            }).catch((err) => {
                console.log(err);
            });
    }

    static remove(id) {
        const db = getdb();
        return db.collection('user')
            .deleteOne({
                _id: new mongodb.ObjectId(id)
            })
            .then((result) => {
                console.log(result.result.nModified);
            }).catch((err) => {
                console.log(err);
            });
    }

    static tripcheck(id, value) {
        const db = getdb();

        return db.collection('user')
            .find({
                _id: new mongo.ObjectID(id),
                Trips: {
                    $elemMatch: {
                        $or: [{
                                $and: [{
                                        Pickup: value.Pickup
                                    },
                                    {
                                        Drop: value.Drop
                                    },
                                ]
                            },
                            {
                                $and: [{ // Alredy -> New     
                                        Pickup: { // P - D  -> P - D
                                            $lt: value.Pickup // 7 - 12 -> 6 - 10
                                        }
                                    },
                                    {
                                        Drop: {
                                            $gt: value.Pickup
                                        }
                                    }
                                ]
                            }, {
                                $and: [{ // Alredy -> New     
                                        Pickup: { // P - D  -> P - D
                                            $lt: value.Drop // 7 - 12 -> 8 - 10
                                        }
                                    },
                                    {
                                        Drop: {
                                            $gt: value.Drop
                                        }
                                    },
                                ]
                            }
                        ]
                    }
                }
            }).toArray()
            .then(result => {
                console.log("Exist");
                console.log(result);
                return result;
            })
            .catch(err => console.log(err));
    }

    static updatetrips(id, value) {

        const db = getdb();
        return db.collection('user')
            .updateOne({
                _id: new mongo.ObjectID(id)
            }, {
                $push: {
                    Trips: value
                }
            })
            .then(result => console.log(result.result.nModified))
            .catch(err => console.log(err));
    }

    static updateseats(validator, value) {

        const db = getdb();
        return db.collection('user')
            .updateOne({
                _id: new mongodb.ObjectID(validator.id)
            }, {
                $push: {
                    "Trips.$[i].Booked_Seats": {
                        $each: [...value]
                    }
                }
            }, {

                arrayFilters: [{
                    "i.From": validator.From,
                    "i.To": validator.To,
                    "i.Pickup": new Date(validator.Pickup),
                    "i.Drop": new Date(validator.Drop),
                    "i.Economy_Cost": validator.Economy_Cost,
                    "i.FirstClass_Cost": validator.FirstClass_Cost
                }]
            })
            .then(result => console.log(result.result.nModified))
            .catch(err => console.log(err));
    }

    static fetchAll() {

        const db = getdb();
        return db.collection('user')
            .find()
            .toArray()
            .then(users => {
                console.log(users);
                return users;
            })
            .catch(err => console.log(err));
    }
    static fetchseats(validator) {

        const db = getdb();
        // console.log(validator);

        return new Promise((resolve, reject) => {

            db.collection('user').aggregate([{
                "$match": {
                    "_id": new mongodb.ObjectID(validator.id)
                }
            }, {
                "$project": {
                    'Trips': {
                        '$map': {
                            'input': {
                                '$filter': {
                                    'input': '$Trips',
                                    'as': 'hobbyf',
                                    'cond': {
                                        '$and': [{
                                                '$eq': [
                                                    '$$hobbyf.From', validator.From
                                                ]
                                            },
                                            {
                                                '$eq': [
                                                    '$$hobbyf.To', validator.To
                                                ]
                                            },
                                        ]
                                    }
                                }
                            },
                            'as': 'hobbym',
                            'in': {
                                'Seats': '$$hobbym.Booked_Seats'
                            }
                        }
                    }
                }
            }], (err, result) => {
                result.toArray(function (err, documents) {
                    // console.log(documents[0].Trips[0].Seats)
                    console.log(documents[0].Trips[0].Seats);
                    return resolve(documents[0].Trips[0].Seats);
                });
            });
        })
    }
}
module.exports = User;