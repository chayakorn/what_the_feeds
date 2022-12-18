var admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "/***** replace with your databaseURL ************/",
});

var db = getFirestore();

var options = [{
        id: "5fREBlTCSLoO6PprUSx3",
        user_id: "bill",
        is_dark_theme: false,
        auth: { email: false, mobile: false },
    },
    {
        id: "7yhHCrH5DuOWOICepql4",
        user_id: "superman",
        is_dark_theme: true,
        auth: { mobile: true, email: false },
    },
    {
        id: "FjZRbuZtyGAAlxie9jsD",
        auth: { email: false, mobile: false },
        is_dark_theme: false,
        user_id: "film",
    },
    {
        id: "G7OLiYXdi7BUbTBLuq6a",
        user_id: "steve",
        auth: { email: false, mobile: false },
        is_dark_theme: false,
    },
    {
        id: "MOZnobMTLoUB67F7L56Z",
        is_dark_theme: false,
        user_id: "bklyn",
        auth: { mobile: false, email: false },
    },
    {
        id: "NiHSZcGgYtOEa3C47wsu",
        is_dark_theme: true,
        user_id: "noah",
        auth: { email: false, mobile: false },
    },
    { id: "Sw1UKztJGwq9mUgfJ1X2", user_id: "bom", is_dark_theme: true },
    {
        id: "T9QMthQzkHV58QIpi6Ts",
        is_dark_theme: false,
        user_id: "yok",
        auth: { email: false, mobile: false },
    },
    {
        id: "TRxSxeoY8KiDQB7MZbKm",
        user_id: "ppza",
        is_dark_theme: false,
        auth: { mobile: false, email: false },
    },
    {
        id: "aOWejnNKBhbWfrA4Wzne",
        auth: { mobile: true, email: true },
        is_dark_theme: true,
        user_id: "batman",
    },
    {
        id: "jSLMF5pjE8zcDIythpEh",
        auth: { mobile: true, email: true },
        is_dark_theme: true,
        user_id: "rabmeat",
    },
    {
        id: "t1JMVTGNKxOj9yfnC71V",
        is_dark_theme: true,
        auth: { mobile: true, email: false },
        user_id: "yok",
    },
];

options.forEach(function(obj) {
    db.collection("options")
        .doc(obj.id)
        .set({
            is_dark_theme: obj.is_dark_theme,
            auth: obj.auth ? obj.auth : { mobile: false, email: false },
            user_id: obj.user_id,
        })
        .then((docRef) => {
            console.log("Options written with ID : " + obj.id);
        });
});