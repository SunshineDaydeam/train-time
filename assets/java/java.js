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
var trainDisplayArray=[];     

$("#clock").text(moment().format("MMMM Do YYYY, h:mm a"));

//Submit Button Click Handler
$("#submitBtn").on("click", function(event){

    if ($("#nameInput").val().trim() != "" &&                   //if name input isn't blank &
        $("#destinationInput").val().trim() != "" &&            //if destination input isn't blank &
        $("#frequencyInput").val() <=1440 &&                    //if frequency is less than 1 day &
        isNaN($("#frequencyInput").val()) != true &&            //if frequency is a number &
        $("#firstTimeInput").val() != ""                        //if first time input isn't blank
    ){
        trainName = $("#nameInput").val().trim();               //assign name variable
        trainDestination = $("#destinationInput").val().trim(); //assign destination variable
        trainFirst = $("#firstTimeInput").val().trim();         //assign first time variable
        trainFrequency = $("#frequencyInput").val().trim();     //assign frequency variable

        $("#nameInput").val("");                                //clear input boxes
        $("#destinationInput").val("");                         //clear input boxes
        $("#firstTimeInput").val("");                           //clear input boxes
        $("#frequencyInput").val("");                           //clear input boxes

        var newTrain = {                                        //Build an object to contain all information
            trainName: trainName,                               //set trainName to Train Name
            trainDestination: trainDestination,                 //set trainDestination to Train Destination
            trainFirst:trainFirst,                              //set trainFirst to Train First
            trainFrequency: trainFrequency                      //set trainFrequency to train frequency
        };

    database.ref().push(newTrain);                              //Push that object to firebase
    };
});


//When a child is added (Or when page is loaded)
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
                               

    //Define Variables from Snapshot
    var trainInfoName = (childSnapshot.val().trainName);        //create name variable from snapshot
    var trainInfoDest = (childSnapshot.val().trainDestination); //create destination variable from snapshot
    var trainInfoStart = (childSnapshot.val().trainFirst);      //create start time variable from snapshot
    var trainInfoFreq = (childSnapshot.val().trainFrequency);   //create frequency variable from snapshot
    
    
    //Calculate Times
    var firstTimeConverted = moment(trainInfoStart, "hh:mm");                   //convert start time to hours and minutes              
    var currentTime = moment();                                                 //define current time
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");        //calculate number of minutes between first time and current time
    var displayNextTrainMinutes=(trainInfoFreq-(diffTime%trainInfoFreq));       //calculate number of minutes til next train
    var displayNextTrainTime=moment().add(displayNextTrainMinutes, 'minutes');  //calculate the next train time


    //Display to Screen//

    //tablerow
    var tr = $("<tr>");
        tr.addClass("border-bottom remove");
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
        td4.addClass("text-muted nextTrain");
        td4.attr("start", trainInfoStart);
        td4.attr("freq", trainInfoFreq);
                
    //Minutes til next train
    var td5 = $("<td>");
        td5.addClass("text-muted minutes");
        td4.attr("start", trainInfoStart);
        td4.attr("freq", trainInfoFreq);
        

        if (diffTime >=0){
            td4.text(displayNextTrainTime.format("hh:mm"));
            td5.text(displayNextTrainMinutes);
        }
        else{
            td4.text(firstTimeConverted.format("hh:mm"));
            td5.text(diffTime*-1);
            
        }

        //display to html
        tr.append(td1, td2, td3, td4, td5);                                         //append all to tr div
        $("#trainDisplay").append(tr);                                              //Display on Screen

});

//Update timer every 10 seconds
var timer = setInterval(function(){
    //for every instance of next train class
    for (i=0; i<$(".nextTrain").length; i++){
        var ntFreq = $(".nextTrain")[i].getAttribute("freq");                       //define frequency attribute
        var ntStart = $(".nextTrain")[i].getAttribute("start");                     //define start time attribute
            //Calculate Times
        var firstTimeConverted = moment(ntStart, "hh:mm");                          //convert start time to hours and minutes              
        var currentTime = moment();                                                 //define current time
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");        //calculate number of minutes between first time and current time
        var displayNextTrainMinutes=(ntFreq-(diffTime%ntFreq));                     //calculate number of minutes til next train
        var displayNextTrainTime=moment().add(displayNextTrainMinutes, 'minutes');  //calculate the next train time

        //if first train has already started
        if (diffTime >=0){
            $(".nextTrain")[i].textContent = displayNextTrainTime.format("hh:mm");  //update next train time
            $(".minutes")[i].textContent = displayNextTrainMinutes;                 //update minutes til next train
        }
        //if first train hasn't already started
        else{
            $(".nextTrain")[i].textContent = ntStart;                               //display the first train time
            $(".minutes")[i].textContent = diffTime*-1;                             //display minutes til the first train time
        }
        $("#clock").text(moment().format("MMMM Do YYYY, h:mm a"));
    };
    console.log(i)
}, 10000);


