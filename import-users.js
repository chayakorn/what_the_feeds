var admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "/***** replace with your databaseURL ************/",
});

var db = getFirestore();

var users = [{
        id: "batman",
        firstname: "Bruce",
        password: "123456789",
        dob: "2022-12-21T14:40:42.319Z",
        luckynumber: 373,
        lastname: "Lee",
    },
    {
        id: "bill",
        dob: "1955-10-27T17:00:00.835Z",
        firstname: "Bill",
        lastname: "Gates",
        luckynumber: 804,
        password: "123456789",
    },
    {
        id: "bklyn",
        dob: "2022-12-03T17:00:00.245Z",
        firstname: "Kuy",
        lastname: "Nut",
        password: "123456789",
        luckynumber: 796,
    },
    {
        id: "bom",
        password: "1234",
        firstname: "Mash",
        luckynumber: 600,
        dob: "2001-09-11T17:00:00.420Z",
        lastname: "Potato",
    },
    {
        id: "film",
        luckynumber: 885,
        password: "123456789",
        firstname: "film",
        lastname: "naja",
        dob: "2022-12-07T19:27:23.064Z",
    },
    {
        id: "noah",
        dob: "2002-01-07T19:02:53.758Z",
        password: "noahnaja",
        luckynumber: 488,
        firstname: "Ben",
        lastname: "Ten",
    },
    {
        id: "ppza",
        luckynumber: 473,
        firstname: "Pp",
        lastname: "Za",
        dob: "2022-12-03T12:14:58.538Z",
        password: "ppza",
    },
    {
        id: "rabmeat",
        lastname: "Di",
        luckynumber: 629,
        password: "123456789",
        firstname: "J",
        dob: "2022-12-01T11:20:35.044Z",
    },
    {
        id: "steve",
        dob: "2022-12-06T17:00:00.219Z",
        lastname: "Job",
        luckynumber: 853,
        firstname: "Steve",
        password: "jobdb",
    },
    {
        id: "superman",
        password: "kuyterd",
        dob: "2022-11-30T19:37:47.404Z",
        lastname: "Kent",
        luckynumber: 720,
        firstname: "Clark",
    },
    {
        id: "yok",
        password: "brabrabra",
        dob: "2001-10-17T19:04:41.183Z",
        luckynumber: 622,
        lastname: "อิ๋ง",
        firstname: "อุ๋ง",
    },
];

users.forEach(function(obj) {
    db.collection("users")
        .doc(obj.id)
        .set({
            password: obj.password,
            dob: new Date(obj.dob),
            luckynumber: obj.luckynumber,
            lastname: obj.lastname,
            firstname: obj.firstname,
        })
        .then((docRef) => {
            console.log("User written with ID : " + obj.id);
        });
});