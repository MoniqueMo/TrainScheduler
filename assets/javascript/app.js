console.log("helloworld");
$(document).ready(function(){

  // initialize firebase
var config = {
    apiKey: "AIzaSyClfAJnPfYKHzvXrrRUqBBabhRXulUyZBY",
    authDomain: "trainscheduler-905a4.firebaseapp.com",
    databaseURL: "https://trainscheduler-905a4.firebaseio.com",
    projectId: "trainscheduler-905a4",
    storageBucket: "trainscheduler-905a4.appspot.com",
    messagingSenderId: "934055043523"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // append current time

  $("#current-time").append(moment().format("hh:mm A"));

  //submit function to add new trains to current train schedule
$("#submit-button").on("click", function(){
event.preventDefault();

//user input onto schedule table
var trainName = $("#train-line-input").val().trim();
// console.log("this is: " + trainName);
var destination = $("#destination-input").val().trim();
var firstTrain = moment($("#first-train").val().trim(), "hh:mm").subtract(1, "years").format("x");
var frequency = $("#frequency-input").val().trim();

//create local variable to store input

var newTrain = {
  name: trainName,
  destination: destination,
  firstTrainTime: firstTrain,
  frequency: frequency,
}
console.log(newTrain);

database.ref().push(newTrain);

//clear table boxes
$("#train-line-input").val("");
$("#destination-input").val("");
$("#first-train").val("");
$("frequency-input").val("");

});

database.ref().on("child_added", function(childSnapshot, prevchildkey){

  console.log(childSnapshot.val());

  //assign firebase variables to local variables

  var dbTrainName = childSnapshot.val().name;
  var dbDestination = childSnapshot.val().destination;
  var dbFirstTrain = childSnapshot.val().firstTrainTime;
  var dbFrequency = childSnapshot.val().frequency;

  var diffTime = moment().diff(moment.unix(dbFirstTrain), "minutes");
  var timeRemainder = moment().diff(moment.unix(dbFirstTrain),"minutes") % dbFrequency;
  var minutes = dbFrequency - timeRemainder;

  var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A");

  $("#trainTable > tbody").append("<tr><td>" + dbTrainName + "</td><td>" + dbDestination + "</td><td>" + dbFrequency + "mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

});

});