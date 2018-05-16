// Initialize Firebase
var config = {
    apiKey: "AIzaSyAdjxWbPNrfuJ1gTPLv4WoJeVl5S-B_HCc",
    authDomain: "train-time-1c8d0.firebaseapp.com",
    databaseURL: "https://train-time-1c8d0.firebaseio.com",
    projectId: "train-time-1c8d0",
    storageBucket: "",
    messagingSenderId: "1078427159339"
};
  
firebase.initializeApp(config);
var database = firebase.database();

var trainName = "";
var trainDestination = "";
var trainFirst = "";
var trainFrequency = "";


//Submit Button - push info to firebase


    $("#submitBtn").on("click", function(event){
        if ($("#nameInput").val().trim() != "" && $("#destinationInput").val().trim() != "" && $("#frequencyInput").val() <=1440) {
        trainName = $("#nameInput").val().trim();
        trainDestination = $("#destinationInput").val().trim();
        trainFirst = $("#firstTimeInput").val().trim();
        trainFrequency = $("#frequencyInput").val().trim();

        $("#nameInput").val("");
        $("#destinationInput").val("");
        $("#firstTimeInput").val("");
        $("#frequencyInput").val("");

        var newTrain = {
            trainName: trainName,
            trainDestination: trainDestination,
            trainFirst:trainFirst,
            trainFrequency: trainFrequency
        };

        database.ref().push(newTrain);
    };
});


//Update Train Displays
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    //Create Variables of names
    var trainInfoName = (childSnapshot.val().trainName);
    var trainInfoDest = (childSnapshot.val().trainDestination);
    var trainInfoStart = (childSnapshot.val().trainFirst);
    var trainInfoFreq = (childSnapshot.val().trainFrequency);        
    //Calculate Times
    var firstTimeConverted = moment(trainInfoStart, "hh:mm");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var displayNextTrainMinutes=(trainInfoFreq-(diffTime%trainInfoFreq));
    var displayNextTrainTime=moment().add(displayNextTrainMinutes, 'minutes');

    //tablerow
    var tr = $("<tr>");
        tr.addClass("border-bottom");
    //train name
    var td1 = $("<td>");
        td1.text(trainInfoName);
    //train destination
    var td2 = $("<td>");
        td2.addClass("text-muted");
        td2.text(trainInfoDest);
    //train frequency
    var td3 = $("<td>");
        td3.addClass("text-muted");
        td3.text(trainInfoFreq + " minutes");
    //Next Arrival
    var td4 = $("<td>");
        td4.addClass("text-muted");
        td4.attr("id", trainInfoName.replace(/\s/g, ''));
        td4.text(moment(displayNextTrainTime).format('hh:mm'));
        console.log(displayNextTrainMinutes);
    //Minutes til next train
    var td5 = $("<td>");
        td5.addClass("text-muted");
        td5.text(displayNextTrainMinutes);

        //display to html
        tr.append(td1, td2, td3, td4, td5);
        $("#trainDisplay").append(tr);


    console.log(childSnapshot.val().trainDestination);

});