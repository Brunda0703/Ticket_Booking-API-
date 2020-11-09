const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let db;

const mongoConnect = callback => {

    MongoClient.connect('mongodb+srv://brunda:b070310b@cluster0-eocz5.mongodb.net/Ticket_Booking?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        })
    .then(client => {

        console.log("Connected");
        db = client.db();
        callback();
    })
    .catch(err => {

        console.log("EEEEERRRROOOORRRR");
        console.log(err);
        throw err;
    });
};

const getDb = () => {

    if( db ){
        return db;
    }
    throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;