$(document).ready(function(){

  // Your web app's Firebase configuration
  var config = {
    apiKey: "AIzaSyDRpCTXsxWHA9pIpl-2RhRk8Kbn2AyAvIo",
    authDomain: "train-scheduler-46710.firebaseapp.com",
    databaseURL: "https://train-scheduler-46710.firebaseio.com",
    projectId: "train-scheduler-46710",
    storageBucket: "",
    messagingSenderId: "1079248782101",
    appId: "1:1079248782101:web:5cda48ff14f0014b",
  };

  // Initialize Firebase
  firebase.initializeApp(config);
  

  var database = firebase.database();

  var inputname = "";
  var inputDestination = "";
  var inputFirstTrain = "";
  var inputFrequency = "";


  $("#submit-btn").on("click", function (event) {
    event.preventDefault();

    inputname = $("#name-input").val().trim();
    inputDestination = $("#destination-input").val().trim();
    inputFirstTrain = $("#firsttrain-input").val().trim();
    inputFrequency = $("#frequency-input").val().trim();

    console.log(inputname);
    console.log(inputDestination);
    console.log(inputFirstTrain);
    console.log(inputFrequency);
    
    database.ref().push({

      name: inputname,
      destination: inputDestination,
      firstTrain: inputFirstTrain,
      frequency: inputFrequency,

    });

    $("form").trigger("reset");
  });


  database.ref().on("child_added", function (snapshot){

    var FirstTrain = snapshot.val().firstTrain;
    var tFreq = parseInt(snapshot.val().frequency);

    // captures the time now
    var now = moment();
    console.log(now)

    // First Time (pushed back 1 year to make sure it comes before current time)
    var convertedFirstTrain = moment(FirstTrain, "HH:mm").subtract(1, "years");
    console.log(convertedFirstTrain);
    
    
    // calc diff of time in min btw now and first train 
    var timeDiff = moment().diff(moment(convertedFirstTrain), 'minutes');
    console.log(timeDiff);


    var timeRemainder = timeDiff % tFreq;
    console.log(timeRemainder);

    var timeTillNextTrain = tFreq - timeRemainder;
    console.log(timeTillNextTrain);
    
    var timeOfArrival = moment().add(timeTillNextTrain, 'minutes');
    var nextTrain = moment(timeOfArrival).format("hh:mm");
    console.log(nextTrain)


    // creates new table row and add train data to page 
    var newTableRow = $("<tr>");
    
    var tableName = $("<td>").text(snapshot.val().name);
    var tableDestination = $("<td>").text(snapshot.val().destination);
    var tableFrequency = $("<td>").text(snapshot.val().frequency);
    var tableNextArrival = $("<td>").text(nextTrain);
    var TableMinAway = $("<td>").text(timeTillNextTrain);

    newTableRow.append(tableName).append(tableDestination).append(tableFrequency).append(tableNextArrival).append(TableMinAway);
  
    $("#train-table").append(newTableRow);


  }, function(errorObject) {

    // In case of error this will print the error
    console.log("The read failed: " + errorObject.code);

  });


});