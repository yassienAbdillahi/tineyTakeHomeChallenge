//=============================================================================
//                                   Tabs
//=============================================================================

//openTab fn
function openTab(event, selectedTab) {
    const tabLinks = document.querySelectorAll(".tablinks");
    const tabContent = document.querySelectorAll(".tabContent");

    //loop through and hide all elements with class=tabContent
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    //loop through all elements with class=tablinks and remove the class "active"
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(selectedTab).style.display = "block";
    event.currentTarget.className += " active";
}

/*
open register tab on page load
Get the element with id="defaultOpen" and click on it
*/
document.getElementById("defaultOpen").click();



//=============================================================================
//                               register tab
//=============================================================================


//list of children in the nursery
const nurseryChildren = [
    {
        childName: "Mirabel",
        childImg: "images/mirabel.png"
    },
    {
        childName: "Moana",
        childImg: "images/moana.png"
    },
    {
        childName: "Aladdin",
        childImg: "images/aladdin.png"
    },
    {
        childName: "Jasmine",
        childImg: "images/jasmine.png"
    },
    {
        childName: "Mulan",
        childImg: "images/mulan.png"
    }
];

//fill in the no. of children expected 
document.getElementById("expectedChildren").innerHTML = `${nurseryChildren.length}`;



const signInButtons = document.querySelectorAll(".sign-in");
for (let i = 0; i < signInButtons.length; i++) {
    signInButtons[i].addEventListener("dblclick", instantSignIn);
}

/*
note regarding localstorage as relates the register log:
it is necessary to to turn the original object into a json string before
saving it to local storage because localStorage appears to save the CONTENT 
of the variable (as a string) rather than the variable itself 
which makes the use of object methods impossible
*/

//fn to handle the sign in's
function instantSignIn () {
    
    //get today's date
    const todaysDate = new Date();
    const todaysDateAsISOstring = todaysDate.toISOString();//note this returns date in utc (gmt) not current browser-determined timezone
    const todaysDateAsISOstringSlicedYYMMDD = todaysDateAsISOstring.slice(0, 10);

    //to check if entry for today already exists in local storage, getItem
    const entryToCheck = localStorage.getItem(todaysDateAsISOstringSlicedYYMMDD)
    const entryToCheckAsObject = JSON.parse(entryToCheck);

    /*now check if this is the first sign in of the day
    necessary because we only want one object in the registerLog for each day
    */

    if (
        entryToCheckAsObject == undefined //i.e. if there is no entry to for today
        //if there is no item in the localStorage set using today's date, entryToCheckAsObject is null
        /*using undefined is okay because null has the value undefined
        and this isn't strict equality*/
        
    ) {
        console.log("first sign in today");

        //create an object for today
        const todaysObject = {};

        //add properties to that object
        //each property should correspond to a child
        //the value of those properties should themselves be objects
        //the properties of this inner object should be "in at" and "out at"

        for (let i = 0; i < nurseryChildren.length; i++) {
            let individualChild = nurseryChildren[i]["childName"];

            const individualChildObject = {
                "in at": "pending",
                "out at": "pending"
            };

            todaysObject[individualChild] = individualChildObject;
        }

        //now change the 'in at' property for the correct child
        let childToBeSignedIn = this.id.slice(6); //i.e. the name part of the id of the clicked button
        console.log(childToBeSignedIn);

        todaysObject[childToBeSignedIn]["in at"] = todaysDateAsISOstring.slice(11, 16);
    
        console.log(todaysObject);

        //now add today's object to localStorage after JSON.stringifying it 
        let todaysObjectStringifyed = JSON.stringify(todaysObject);
        localStorage.setItem(todaysDateAsISOstringSlicedYYMMDD, todaysObjectStringifyed);

        //now swap the sign-in button for a sign-out button on the page
        let swapArgOne = `signIn${childToBeSignedIn}`;
        let swapArgTwo = `signOut${childToBeSignedIn}`;
        swapSignInWithSignOutButtons(swapArgOne, swapArgTwo);
        swapColorsToGreen(swapArgOne);

        //now write into the tabOne text for the child
        let tabOneParagraphToBeWrittenInto = `tabOne${childToBeSignedIn}Text`;
        document.getElementById(tabOneParagraphToBeWrittenInto).innerHTML = `Signed in at ${todaysDateAsISOstring.slice(11, 16)}`;
       
    }
    else {
        console.log("not the first sign in of the day")
        
        /*since this if condidition was satisfied, all that needs to be done 
        is changing the value of the 'in at' property for the correct child if they haven't already
        been signed in today*/

        //first get the entry for today from the localStorage
        let registerForTodayPreSignIn = localStorage.getItem(todaysDateAsISOstringSlicedYYMMDD);
        const registerForTodayAsObject = JSON.parse(registerForTodayPreSignIn);


        //then get the name of the child the user clicked
        let childToBeSignedIn = this.id.slice(6); //i.e. the name part of the id of the clicked button
        console.log(childToBeSignedIn);

        //if child has already been signed-in alert the user
        if(
            registerForTodayAsObject[childToBeSignedIn]["in at"] != "pending"
        ) {
            alert(`${childToBeSignedIn} has already been signed in at ${registerForTodayAsObject[childToBeSignedIn]["in at"]} today`);
        }

        else {
            registerForTodayAsObject[childToBeSignedIn]["in at"] = todaysDateAsISOstring.slice(11, 16);
            console.log(registerForTodayAsObject);

            //now go back and change the localStorage entry for today
        
            //first turn the updated register Object back into a json string
            let postSignInRegisterAsString = JSON.stringify(registerForTodayAsObject);

            localStorage.setItem(todaysDateAsISOstringSlicedYYMMDD, postSignInRegisterAsString);

            //now swap the sign-in button for a sign-out button on the page
            let swapArgOne = `signIn${childToBeSignedIn}`;
            let swapArgTwo = `signOut${childToBeSignedIn}`;
            swapSignInWithSignOutButtons(swapArgOne, swapArgTwo);
            swapColorsToGreen(swapArgOne);

            //now write into the tabOne text for the child
            let tabOneParagraphToBeWrittenInto = `tabOne${childToBeSignedIn}Text`;
            document.getElementById(tabOneParagraphToBeWrittenInto).innerHTML = `Signed in at ${todaysDateAsISOstring.slice(11, 16)}`;
        }

        
    }

    //at the end, alert the user 
    alert(`${this.id.slice(6)} was succesfully signed in`);

   
}

function swapSignInWithSignOutButtons (signInButtonID, signOutButtonID) {
    //make relevant sign-in button invisible
    document.getElementById(signInButtonID).style.display = "none";

    //make relevant sign-out button visible
    document.getElementById(signOutButtonID).style.display = "block";

   
}

function swapColorsToGreen (signInButtonID) {
     //change the Circle Color to green 
     switch(signInButtonID) {
        case "signInMirabel":
        changeCircleColorToGreen(0);
        break;
        case "signInMoana":
        changeCircleColorToGreen(1);
        break;  
        case "signInAladdin":
        changeCircleColorToGreen(2);
        break;  
        case "signInJasmine":
        changeCircleColorToGreen(3);
        break;
        case "signInMulan":
        changeCircleColorToGreen(4);
        break;         
    }
}

function changeCircleColorToGreen (circleClassIndex) {
    document.querySelectorAll(".circle")[circleClassIndex].style.background = "green";
}


//next, fns to do the exact inverse of the three above 
function swapSignOutWithSignInButtons (signInButtonID, signOutButtonID) {
    //make relevant sign-in button visible
    document.getElementById(signInButtonID).style.display = "block";

    //make relevant sign-out button invisible
    document.getElementById(signOutButtonID).style.display = "none";

  
}

function swapColorsToRed (signInButtonID) {
    //change the Circle Color to red 
    switch(signInButtonID) {
    case "signInMirabel":
    changeCircleColorToRed(0);
    break;
    case "signInMoana":
    changeCircleColorToRed(1);
    break;  
    case "signInAladdin":
    changeCircleColorToRed(2);
    break;  
    case "signInJasmine":
    changeCircleColorToRed(3);
    break;
    case "signInMulan":
    changeCircleColorToRed(4);
    break;         
    }
}

function changeCircleColorToRed (circleClassIndex) {
    document.querySelectorAll(".circle")[circleClassIndex].style.background = "rgb(222, 22, 22)";
}




const signOutButtons = document.querySelectorAll(".sign-out");
for (let i = 0; i < signOutButtons.length; i++) {
    signOutButtons[i].addEventListener("dblclick", instantSignOut);
}


//instant sign out fn is basically the same as the instant sign in above, just changing a different property
function instantSignOut () {
    
        //get today's date
        const todaysDate = new Date();
        const todaysDateAsISOstring = todaysDate.toISOString();//note this returns date in utc (gmt) not current browser-determined timezone
        const todaysDateAsISOstringSlicedYYMMDD = todaysDateAsISOstring.slice(0, 10);
        
        /*all that needs to be done is changing the value of the 'out at' property 
        for the correct child if they haven't already been signed out today*/

        //first get the entry for today from the localStorage
        let registerForTodayPreSignIn = localStorage.getItem(todaysDateAsISOstringSlicedYYMMDD);
        const registerForTodayAsObject = JSON.parse(registerForTodayPreSignIn);


        //then get the name of the child the user clicked
        let childToBeSignedOut = this.id.slice(7); //i.e. the name part of the id of the clicked button
        

        //if child has already been signed-out alert the user
        if(
            registerForTodayAsObject[childToBeSignedOut]["out at"] != "pending"
        ) {
            alert(`${childToBeSignedOut} has already been signed out at ${registerForTodayAsObject[childToBeSignedOut]["out at"]} today`);
        }

        else {

            console.log("sign out successful, see who was signed out and full register for today below")

            console.log(childToBeSignedOut);

            registerForTodayAsObject[childToBeSignedOut]["out at"] = todaysDateAsISOstring.slice(11, 16);
            console.log(registerForTodayAsObject);

            //now go back and change the localStorage entry for today
        
            //first turn the updated register sObject back into a json string
            let postSignInRegisterAsString = JSON.stringify(registerForTodayAsObject);

            localStorage.setItem(todaysDateAsISOstringSlicedYYMMDD, postSignInRegisterAsString);

            //now swap the sign-out button for a sign-in button on the page
            let swapArgOne = `signIn${childToBeSignedOut}`;
            let swapArgTwo = `signOut${childToBeSignedOut}`;
            swapSignOutWithSignInButtons(swapArgOne, swapArgTwo);
            swapColorsToRed(swapArgOne);

            //now write into the tabOne text for the child
            let tabOneParagraphToBeWrittenInto = `tabOne${childToBeSignedOut}Text`;
            document.getElementById(tabOneParagraphToBeWrittenInto).innerHTML = `Signed out`;
        }


        //at the end, alert the user 
        alert(`${childToBeSignedOut} was succesfully signed out`);
   
}


//=============================================================================
//                              confirmation page popup
//=============================================================================


// Get the modal
const modal = document.getElementById("confirmationPageForSignIn");

// Get the button that opens the modal i.e. the regular sign in buttons if they are clicked just once not double-clicked
//see line 67 where they are defined as so: const signInButtons = document.querySelectorAll(".sign-in");


// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on any of the sign in buttons, open the modal
//unless of course that child has ALREADY been signed in

for (let i = 0; i < signInButtons.length; i++) {
    signInButtons[i].addEventListener("click", displayModal);
}

function displayModal () {
    //get today's date
    const todaysDate = new Date();
    const todaysDateAsISOstring = todaysDate.toISOString();//note this returns date in utc (gmt) not current browser-determined timezone
    const todaysDateAsISOstringSlicedYYMMDD = todaysDateAsISOstring.slice(0, 10);

    const startOfDay = `T00:00:00`;
    const endOfDay = `T23:59:59`;

    //set today as the max and min limits for the user input in the confirm sign in form
    const timeOfSignIn = document.getElementById("timeOfSignIn");
    timeOfSignIn.max = todaysDateAsISOstringSlicedYYMMDD + endOfDay;
    timeOfSignIn.min = todaysDateAsISOstringSlicedYYMMDD + startOfDay;

    //to check if entry for today already exists in local storage, getItem
    const entryToCheck = localStorage.getItem(todaysDateAsISOstringSlicedYYMMDD)
    const entryToCheckAsObject = JSON.parse(entryToCheck);

    //get the name of the child the user clicked
    let childToBeSignedIn = this.id.slice(6); //i.e. the name part of the id of the clicked button
    console.log(childToBeSignedIn);

    /*now check if the child has already been signed in today
    */

    if (//i.e if none of the children have been signed in yet today OR this specofic child has not been signed in yet
         (entryToCheckAsObject == undefined) || (entryToCheckAsObject[childToBeSignedIn]["in at"] == "pending")
    ) {
        //fill in the selected child's name on the page
        document.getElementById("confirmedChildForSignIn").innerHTML = childToBeSignedIn;

        //then display the confirmation page
        modal.style.display = "block";
    }
    else {
        alert(`${childToBeSignedIn} has already been signed in at ${entryToCheckAsObject[childToBeSignedIn]["in at"]} today`);
    }
}

// When the user clicks on <span> (x), close the modal
span.addEventListener("click", closeModal);

function closeModal () {
    modal.style.display = "none";
}


//now to deal with the actual sign-ins done via the confirmation page
let confirmatioFormFornSignIn = document.getElementById("signInConfirmation");
confirmatioFormFornSignIn.addEventListener("submit", confirmSignIn);

function confirmSignIn (event) {
    event.preventDefault();

    //first get the correct child's name
    let childToBeConfirmedAsSignedIn = document.getElementById("confirmedChildForSignIn").innerText;
    console.log(childToBeConfirmedAsSignedIn);

    let usersChosenTimeForConfimationOfSignIn = document.getElementById("timeOfSignIn").value; //returns ISO-date format including hours and minutes eg 2022-06-29T13:18
    /*need to convert this to utc since the input is based off the user's local time and the instant sign in fn uses utc
    the two sign-in fns should both log time according to the SAME timezone*/
    //to use the toutcstring method I need to first convert the users chosen date into a date object
    let userYear = usersChosenTimeForConfimationOfSignIn.slice(0, 4);
    let userMonth = usersChosenTimeForConfimationOfSignIn.slice(5, 7);
    let userDay = usersChosenTimeForConfimationOfSignIn.slice(8, 10);
    let userHours = usersChosenTimeForConfimationOfSignIn.slice(11, 13);
    let userMinutes = usersChosenTimeForConfimationOfSignIn.slice(14);

    let userDateToBeConverted = new Date (userYear, userMonth, userDay, userHours, userMinutes);
    let convertedDate = userDateToBeConverted.toUTCString();
    console.log(convertedDate);

    let justConvertedHoursAndMinutes = convertedDate.slice(16, 22);

    /*
    next, sign in the child. basically just copied this bit from the instant sign in fn 
    but changed:
    - the bits that use 'this' to access the child's name since there is only
    ONE button clicked which does not have the child's name to be sliced out as before
    - removed the if condition testing if the child has already been signed in since this is
    already done by the display modal function
    - the time the sign in records so it's no longer automatically the current time but determined by the user
    */


    //get today's date
    const todaysDate = new Date();
    const todaysDateAsISOstring = todaysDate.toISOString();//note this returns date in utc (gmt) not current browser-determined timezone
    const todaysDateAsISOstringSlicedYYMMDD = todaysDateAsISOstring.slice(0, 10);

    //to check if entry for today already exists in local storage, getItem
    const entryToCheck = localStorage.getItem(todaysDateAsISOstringSlicedYYMMDD)
    const entryToCheckAsObject = JSON.parse(entryToCheck);

    /*now check if this is the first sign in of the day
    necessary because we only want one object in the registerLog for each day
    */

    if (
        entryToCheckAsObject == undefined //i.e. if there is no entry to for today
        //if there is no item in the localStorage set using today's date, entryToCheckAsObject is null
        /*using undefined is okay because null has the value undefined
        and this isn't strict equality*/
        
    ) {
        console.log("first sign in today");

        //create an object for today
        const todaysObject = {};

        //add properties to that object
        //each property should correspond to a child
        //the value of those properties should themselves be objects
        //the properties of this inner object should be "in at" and "out at"

        for (let i = 0; i < nurseryChildren.length; i++) {
            let individualChild = nurseryChildren[i]["childName"];

            const individualChildObject = {
                "in at": "pending",
                "out at": "pending"
            };

            todaysObject[individualChild] = individualChildObject;
        }

        //now change the 'in at' property for the correct child
        //the correct child is found from childToBeConfirmedAsSignedIn = document.getElementById("confirmedChildForSignIn").innerText; in line 411

        todaysObject[childToBeConfirmedAsSignedIn]["in at"] = justConvertedHoursAndMinutes;
    
        console.log(todaysObject);

        //now add today's object to localStorage after JSON.stringifying it 
        let todaysObjectStringifyed = JSON.stringify(todaysObject);
        localStorage.setItem(todaysDateAsISOstringSlicedYYMMDD, todaysObjectStringifyed);

        //now swap the sign-in button for a sign-out button on the page
        let swapArgOne = `signIn${childToBeConfirmedAsSignedIn}`;
        let swapArgTwo = `signOut${childToBeConfirmedAsSignedIn}`;
        swapSignInWithSignOutButtons(swapArgOne, swapArgTwo);
        swapColorsToGreen(swapArgOne);

        //now write into the tabOne text for the child
        let tabOneParagraphToBeWrittenInto = `tabOne${childToBeConfirmedAsSignedIn}Text`;
        document.getElementById(tabOneParagraphToBeWrittenInto).innerHTML = `Signed in at ${justConvertedHoursAndMinutes}`;
       
    }
    else {
        console.log("not the first sign in of the day")
        
        /*since this if condidition was satisfied, all that needs to be done 
        is changing the value of the 'in at' property for the correct child if they haven't already
        been signed in today*/

        //first get the entry for today from the localStorage
        let registerForTodayPreSignIn = localStorage.getItem(todaysDateAsISOstringSlicedYYMMDD);
        const registerForTodayAsObject = JSON.parse(registerForTodayPreSignIn);


        //then get the name of the child the user clicked
        //the correct child is found from childToBeConfirmedAsSignedIn = document.getElementById("confirmedChildForSignIn").innerText; in line 411

       
            registerForTodayAsObject[childToBeConfirmedAsSignedIn]["in at"] = justConvertedHoursAndMinutes;
            console.log(registerForTodayAsObject);

            //now go back and change the localStorage entry for today
        
            //first turn the updated register Object back into a json string
            let postSignInRegisterAsString = JSON.stringify(registerForTodayAsObject);

            localStorage.setItem(todaysDateAsISOstringSlicedYYMMDD, postSignInRegisterAsString);

            //now swap the sign-in button for a sign-out button on the page
            let swapArgOne = `signIn${childToBeConfirmedAsSignedIn}`;
            let swapArgTwo = `signOut${childToBeConfirmedAsSignedIn}`;
            swapSignInWithSignOutButtons(swapArgOne, swapArgTwo);
            swapColorsToGreen(swapArgOne);

            //now write into the tabOne text for the child
            let tabOneParagraphToBeWrittenInto = `tabOne${childToBeConfirmedAsSignedIn}Text`;
            document.getElementById(tabOneParagraphToBeWrittenInto).innerHTML = `Signed in at ${justConvertedHoursAndMinutes}`;     
    }

    //at the end, alert the user of succesful sign in confirmation and close the popup
    alert(`${childToBeConfirmedAsSignedIn} was succesfully signed in`);
    
    span.click();


}

let absentButton = document.getElementById("absentButton");
absentButton.addEventListener("click", reportAbsent);

function reportAbsent () {
    //first get the correct child's name
    let childToBeReportedAbsent = document.getElementById("confirmedChildForSignIn").innerText;
    console.log(childToBeReportedAbsent);

    //get today's date
    const todaysDate = new Date();
    const todaysDateAsISOstring = todaysDate.toISOString();//note this returns date in utc (gmt) not current browser-determined timezone
    const todaysDateAsISOstringSlicedYYMMDD = todaysDateAsISOstring.slice(0, 10);

    //to check if entry for today already exists in local storage, getItem
    const entryToCheck = localStorage.getItem(todaysDateAsISOstringSlicedYYMMDD)
    const entryToCheckAsObject = JSON.parse(entryToCheck);

    if (
        entryToCheckAsObject == undefined //i.e. if there is no entry to for today i.e no sign ins before the absence report
        //if there is no item in the localStorage set using today's date, entryToCheckAsObject is null
        /*using undefined is okay because null has the value undefined
        and this isn't strict equality*/
    ) {
        console.log("No sign ins yet today, first register action is absence record");

        //create an object for today
        const todaysObject = {};

        //add properties to that object
        //each property should correspond to a child
        //the value of those properties should themselves be objects
        //the properties of this inner object should be "in at" and "out at"

        for (let i = 0; i < nurseryChildren.length; i++) {
            let individualChild = nurseryChildren[i]["childName"];

            const individualChildObject = {
                "in at": "pending",
                "out at": "pending"
            };

            todaysObject[individualChild] = individualChildObject;
        }

        //now add an "absent" property for the correct child
        todaysObject[childToBeReportedAbsent]["absent"] = `${childToBeReportedAbsent} was absent on this day`;

        //now add today's object to localStorage after JSON.stringifying it 
        let todaysObjectStringifyed = JSON.stringify(todaysObject);
        localStorage.setItem(todaysDateAsISOstringSlicedYYMMDD, todaysObjectStringifyed);

        //now hide both the sign in and sign out buttons for that child
        let signInButtonForTheAbsentChild = `signIn${childToBeReportedAbsent}`;
        let signOutButtonForTheAbsentChild = `signOut${childToBeReportedAbsent}`;

        document.getElementById(signInButtonForTheAbsentChild).style.display = "none";
        document.getElementById(signOutButtonForTheAbsentChild).style.display = "none";

        //now write into the tabOne text for the child
        let tabOneParagraphToBeWrittenInto = `tabOne${childToBeReportedAbsent}Text`;
        document.getElementById(tabOneParagraphToBeWrittenInto).innerHTML = `${childToBeReportedAbsent} has been recorded as absent for today`;

        //now change the circle color to grey
        swapCircleColorToGrey(signInButtonForTheAbsentChild);
    }
    else {
        //i.e. if other sign ins have happened before the absence report

        /*since this if condidition was satisfied, all that needs to be done 
        is adding an "absent" property for the correct child*/

        //first get the entry for today from the localStorage: already done in line 566,567

        //then get the correct child: already done in line 557

        //now add the property

        entryToCheckAsObject[childToBeReportedAbsent]["absent"] = `${childToBeReportedAbsent} was absent on this day`;

        //now add today's object to localStorage after JSON.stringifying it 
        let todaysObjectStringifyed = JSON.stringify(entryToCheckAsObject);
        localStorage.setItem(todaysDateAsISOstringSlicedYYMMDD, todaysObjectStringifyed);

        //now hide both the sign in and sign out buttons for that child
        let signInButtonForTheAbsentChild = `signIn${childToBeReportedAbsent}`;
        let signOutButtonForTheAbsentChild = `signOut${childToBeReportedAbsent}`;

        document.getElementById(signInButtonForTheAbsentChild).style.display = "none";
        document.getElementById(signOutButtonForTheAbsentChild).style.display = "none";

        //now write into the tabOne text for the child
        let tabOneParagraphToBeWrittenInto = `tabOne${childToBeReportedAbsent}Text`;
        document.getElementById(tabOneParagraphToBeWrittenInto).innerHTML = `${childToBeReportedAbsent} has been recorded as absent for today`;

        //now change the circle color to grey
        swapCircleColorToGrey(signInButtonForTheAbsentChild);
    }

    //at the end, alert the user of succesful sign in confirmation and close the popup
    alert(`${childToBeReportedAbsent} was marked absent`);
    
    span.click();


}

function swapCircleColorToGrey (signInButtonID) {
    //change the Circle Color to grey 
    switch(signInButtonID) {
        case "signInMirabel":
        changeCircleColorToGrey(0);
        break;
        case "signInMoana":
        changeCircleColorToGrey(1);
        break;  
        case "signInAladdin":
        changeCircleColorToGrey(2);
        break;  
        case "signInJasmine":
        changeCircleColorToGrey(3);
        break;
        case "signInMulan":
        changeCircleColorToGrey(4);
        break;         
    }
}


function changeCircleColorToGrey (circleClassIndex) {
    document.querySelectorAll(".circle")[circleClassIndex].style.background = "grey";
}



//=============================================================================
//                               history tab
//=============================================================================


let form2 = document.querySelector("#form2");
form2.addEventListener("submit", historyTabLogRetrieval);

function historyTabLogRetrieval (event) {
    event.preventDefault();
    console.log("input submission is working, user chosen date to follow");
    const searchedDate = document.querySelector("#searchedDate").value;
    console.log(searchedDate);
    console.log(typeof searchedDate);

    let entryToGetFromLocalStorage = localStorage.getItem(searchedDate);

    if (
        entryToGetFromLocalStorage == undefined
        //i.e. if there is no entry in local storage for that day
    ) {alert(`Sorry, there is no register recorded for that day`);}
    else {
        let registerForSearchedDateAsObj = JSON.parse(entryToGetFromLocalStorage);
        console.log(registerForSearchedDateAsObj);


        //next write into the class="register-text" paragraphs using the above data

        //loop through the object and check if the "in at" and "out at" properties still say pending
        for (let x in registerForSearchedDateAsObj) {
            if (//i.e. if there is no record for one particular child for that day and they haven't been marked absent
                  (registerForSearchedDateAsObj[x]["in at"] == "pending") && 
                  (registerForSearchedDateAsObj[x]["out at"] == "pending") &&
                  (registerForSearchedDateAsObj[x]["absent"] == undefined)
                ) {
                    //show the respective add fn
                    let addButtonIdToShow = `addRegister${x}`;
                    document.getElementById(addButtonIdToShow).style.display = "block";

                    //write into the reg text paragraph
                    let regTextParaToWriteInto = `regText${x}`;
                    document.getElementById(regTextParaToWriteInto).innerHTML = "No register record";
                }
            else if (//i.e. if there is only a sign in but no sign out record for one particular child for that day
                      (registerForSearchedDateAsObj[x]["in at"] != "pending") && 
                      (registerForSearchedDateAsObj[x]["out at"] == "pending")
                    ) {
                        //write into the reg text paragraph
                        let regTextParaToWriteInto = `regText${x}`;
                        document.getElementById(regTextParaToWriteInto).innerHTML = `In at ${registerForSearchedDateAsObj[x]["in at"]}. There is no out at record.`;

                        //display the correct add function
                        switch(x) {
                            case "Mirabel":
                            document.querySelectorAll(".add")[0].style.display = "block";
                            break;
                            case "Moana":
                            document.querySelectorAll(".add")[1].style.display = "block"
                            break;  
                            case "Aladdin":
                            document.querySelectorAll(".add")[2].style.display = "block"
                            break;  
                            case "Jasmine":
                            document.querySelectorAll(".add")[3].style.display = "block"
                            break;
                            case "Mulan":
                            document.querySelectorAll(".add")[4].style.display = "block"
                            break;  
                        }
            }
            else if(
                //i.e if the child was reported as absent
                registerForSearchedDateAsObj[x]["absent"] != undefined
            ) {
                //write into the reg text paragraph
                let regTextParaToWriteInto = `regText${x}`;
                document.getElementById(regTextParaToWriteInto).innerHTML = `${x} was marked as absent.`;
            }
            else {
                //write into the reg text paragraph
                let regTextParaToWriteInto = `regText${x}`;
                document.getElementById(regTextParaToWriteInto).innerHTML = `In at ${registerForSearchedDateAsObj[x]["in at"]}. Out at ${registerForSearchedDateAsObj[x]["out at"]}.`;
            }    
        }

        //next display the register
        document.querySelector(".registerToBeShown").style.display = "block";
    }
    
}



const addButtons = document.querySelectorAll(".add");
for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener("click", addRegisterEntryAtLaterDate);
}

function addRegisterEntryAtLaterDate() {
    console.log(this.id);
    console.log("apples");
    console.log(
        searchedDate.value
    );

    //get the child the add button was clicked for
    let childWeAreAddingRegisterEntryFor = this.id.slice(11);
    console.log(childWeAreAddingRegisterEntryFor);


    //need to insert adjacent html which will be a a date input

    const startOfDay = `T00:00:00`;
    const endOfDay = `T23:59:59`;

    const formID = `formFor${childWeAreAddingRegisterEntryFor}`

    let htmlToBeAdded = `<form id=${formID} class="row f-center">
    <label for="userEnteredSignInTimeFor${childWeAreAddingRegisterEntryFor}">Sign In Time</label>
    <input id="userEnteredSignInTimeFor${childWeAreAddingRegisterEntryFor}" type="datetime-local" max="${searchedDate.value + endOfDay}" min="${searchedDate.value + startOfDay}">
    <br>
    <label for="userEnteredSignOutTimeFor${childWeAreAddingRegisterEntryFor}">Sign Out Time</label>
    <input id="userEnteredSignOutTimeFor${childWeAreAddingRegisterEntryFor}" type="datetime-local" max="${searchedDate.value + endOfDay}" min="${searchedDate.value + startOfDay}">
    <button type="submit" class="search">Add to register</button>
    </form>`;

    let addButtonThatWasClicked = document.getElementById(this.id);
    addButtonThatWasClicked.insertAdjacentHTML("afterend", htmlToBeAdded);

    //now create eventlistener to handle form 3's submission
    
    let form3 = document.getElementById(formID);
    form3.addEventListener("submit", formThreeHandler)
}

function formThreeHandler (event) {
    event.preventDefault();
    console.log("form 3 submission is working");

    //get the entry corresponding to the searched date from local storage
    let registerEntryToBeAddedTo = localStorage.getItem(searchedDate.value);
    let registerEntryToBeAddedToAsObj = JSON.parse(registerEntryToBeAddedTo);
    console.log(registerEntryToBeAddedToAsObj);


    //get the sign in time the user entered
    let userEnteredTime = document.querySelectorAll("input[type='datetime-local']")[0].value;
    console.log(userEnteredTime);
    let justHoursAndMinutes = userEnteredTime.slice(11);
    console.log(justHoursAndMinutes);

    //get the sign out time the user entered
    let userEnteredTimeTwo = document.querySelectorAll("input[type='datetime-local']")[1].value;
    console.log(userEnteredTimeTwo);
    let justHoursAndMinutesTwo = userEnteredTimeTwo.slice(11);
    console.log(justHoursAndMinutesTwo);

    //get the correct child
    let correctChild = this.id;
    let correctChildName = correctChild.slice(7);
    console.log(correctChildName);
    

    /*now change the in at and out at properties, ONLY if they have been entered by the user
    i.e. maybe they originally entered the in at but now JUST want to enter the out at at a later date
    and vice versa*/
    
    if(//i.e if the user entered both times
        (justHoursAndMinutes != "") && (justHoursAndMinutesTwo != "")
    ) {
    //now change the "in at" property of the child
    registerEntryToBeAddedToAsObj[correctChildName]["in at"] = justHoursAndMinutes;
    console.log(registerEntryToBeAddedToAsObj);

    //now change the "out at" property of the child
    registerEntryToBeAddedToAsObj[correctChildName]["out at"] = justHoursAndMinutesTwo;
    console.log(registerEntryToBeAddedToAsObj);

    //now update local storage


    //now add today's object to localStorage after JSON.stringifying it 
    let todaysObjectStringifyed = JSON.stringify(registerEntryToBeAddedToAsObj);
    localStorage.setItem(searchedDate.value, todaysObjectStringifyed);

    //now hide the correct add button
    switch(correctChildName) {
        case "Mirabel":
        document.querySelectorAll(".add")[0].style.display = "none";
        break;
        case "Moana":
        document.querySelectorAll(".add")[1].style.display = "none"
        break;  
        case "Aladdin":
        document.querySelectorAll(".add")[2].style.display = "none"
        break;  
        case "Jasmine":
        document.querySelectorAll(".add")[3].style.display = "none"
        break;
        case "Mulan":
        document.querySelectorAll(".add")[4].style.display = "none"
        break;  
    }
  }

  else if(//i.e. the user entered just the sign in time
    (justHoursAndMinutes != "") && (justHoursAndMinutesTwo == "")
  ) {
    //now change the "in at" property of the child
    registerEntryToBeAddedToAsObj[correctChildName]["in at"] = justHoursAndMinutes;
    console.log(registerEntryToBeAddedToAsObj);

    //now update local storage

    //now add today's object to localStorage after JSON.stringifying it 
    let todaysObjectStringifyed = JSON.stringify(registerEntryToBeAddedToAsObj);
    localStorage.setItem(searchedDate.value, todaysObjectStringifyed);

    //now hide the correct add button if both in at and out values in the object are filled
    if(
        (registerEntryToBeAddedToAsObj[correctChildName]["in at"] != "pending") &&
        (registerEntryToBeAddedToAsObj[correctChildName]["out at"] != "pending")
    ) {
        switch(correctChildName) {
            case "Mirabel":
            document.querySelectorAll(".add")[0].style.display = "none";
            break;
            case "Moana":
            document.querySelectorAll(".add")[1].style.display = "none"
            break;  
            case "Aladdin":
            document.querySelectorAll(".add")[2].style.display = "none"
            break;  
            case "Jasmine":
            document.querySelectorAll(".add")[3].style.display = "none"
            break;
            case "Mulan":
            document.querySelectorAll(".add")[4].style.display = "none"
            break;  
        }
    }
    
  }

  else if(
      //i.e. if the user just entered the sign out time
      (justHoursAndMinutes == "") && (justHoursAndMinutesTwo != "")
  ) {
      //now change the "out at" property of the child
    registerEntryToBeAddedToAsObj[correctChildName]["out at"] = justHoursAndMinutesTwo;
    console.log(registerEntryToBeAddedToAsObj);

    //now update local storage

    //now add today's object to localStorage after JSON.stringifying it 
    let todaysObjectStringifyed = JSON.stringify(registerEntryToBeAddedToAsObj);
    localStorage.setItem(searchedDate.value, todaysObjectStringifyed);

    //now hide the correct add button if both in at and out values in the object are filled
    if(
        (registerEntryToBeAddedToAsObj[correctChildName]["in at"] != "pending") &&
        (registerEntryToBeAddedToAsObj[correctChildName]["out at"] != "pending")
    ) {
        switch(correctChildName) {
            case "Mirabel":
            document.querySelectorAll(".add")[0].style.display = "none";
            break;
            case "Moana":
            document.querySelectorAll(".add")[1].style.display = "none"
            break;  
            case "Aladdin":
            document.querySelectorAll(".add")[2].style.display = "none"
            break;  
            case "Jasmine":
            document.querySelectorAll(".add")[3].style.display = "none"
            break;
            case "Mulan":
            document.querySelectorAll(".add")[4].style.display = "none"
            break;  
        }
    }
  }

  else {//do nothing except alert the user if they haven't entered either a sign in or sign out time
    alert(`Please select a sign in time or a sign out time, or both`);
  }

}


//=============================================================================
//                                onload fn 
//=============================================================================

/*to determine whether to show the sign in or sign out buttons when the page refreshes, 
depending on the register status of each child for the day*/

window.addEventListener("load", registerStatusCheck);

function registerStatusCheck () {
    console.log(`onload fn is working`);

    //get today's date
    const todaysDate = new Date();
    const todaysDateAsISOstring = todaysDate.toISOString();//note this returns date in utc (gmt) not current browser-determined timezone
    const todaysDateAsISOstringSlicedYYMMDD = todaysDateAsISOstring.slice(0, 10);

    //to check if entry for today already exists in local storage, getItem
    const entryToCheck = localStorage.getItem(todaysDateAsISOstringSlicedYYMMDD)
    const entryToCheckAsObject = JSON.parse(entryToCheck);
    

    if (/*if a child (in this case Mulan) is starting at a later date, change the circle color to amber and hide both the sign in buttons*/
         (document.getElementById("tabOneMulanText").innerText == "Starting at a later date") && 
         (
             (entryToCheckAsObject == undefined) || ( 
                 (entryToCheckAsObject["Mulan"]["in at"] == "pending") && (entryToCheckAsObject["Mulan"]["out at"] == "pending") 
                 )
         )
        ) {
            console.log("amber working");
            swapColorsToAmber("signInMulan");

            document.getElementById("signInMulan").style.display = "none";
            document.getElementById("signOutMulan").style.display = "none";
        }
    else {}
    
    if(entryToCheckAsObject == undefined){
        console.log("do nothing one");
    } //i.e. if no sign ins have happened today and none of the children are starting at a later date, page default is fine
    else {
        //loop through every child in the register, check their "in at" and "out at" properties
        for (let x in entryToCheckAsObject) {

            let relevantPtagId = `tabOne${x}Text`;
            let a = `signIn${x}`;
            let b = `signOut${x}`;

            if(//i.e if a child was marked absent, change the text of the releavant paragraph, hide both buttons and change circle color to grey
                entryToCheckAsObject[x]["absent"] != undefined
                ) {
                    console.log("absence shown");

                    //hide both the sign in and sign out buttons for that child
                    document.getElementById(a).style.display = "none";
                    document.getElementById(b).style.display = "none";
                    
                    //now write into the tabOne text for the child
                    document.getElementById(relevantPtagId).innerHTML = `${x} has been recorded as absent for today`;

                    //now change the circle color to grey
                    swapCircleColorToGrey(a);

            }
            /*if a child has been signed in AND signed out, change the text of the relevant p tag to show the time they were signed out
            and hide both buttons*/
            else if (
                (entryToCheckAsObject[x]["in at"] != "pending") && (entryToCheckAsObject[x]["out at"] != "pending")
            ) {
                document.getElementById(relevantPtagId).innerText = `Signed in at ${entryToCheckAsObject[x]["in at"]} and signed out at ${entryToCheckAsObject[x]["out at"]}`;

                document.getElementById(a).style.display = "none";
                document.getElementById(b).style.display = "none";
            }

            /*if a child has been signed in BUT NOT signed out, change the text of the relevant p tag to show the time they were signed in
            and display the sign out button instead of the sign in button*/
            else if(
                (entryToCheckAsObject[x]["in at"] != "pending") && (entryToCheckAsObject[x]["out at"] == "pending")
            ) {
                document.getElementById(relevantPtagId).innerText = `Signed in at ${entryToCheckAsObject[x]["in at"]}`;

                //now call the swap fns with the correct arguments
                swapSignInWithSignOutButtons(a, b);
                swapColorsToGreen(a);
            }
            else {
                console.log("do nothing, for some children");
               /*do nothing since page default is fine for children that have neither been signed in nor signed out*/
            }
        }


        
    }
}

//swap colors to amber fns, just for Mulan
function swapColorsToAmber (signInButtonID) {
    //change the Circle Color to red 
    switch(signInButtonID) {
    case "signInMirabel":
    changeCircleColorToAmber(0);
    break;
    case "signInMoana":
    changeCircleColorToAmber(1);
    break;  
    case "signInAladdin":
    changeCircleColorToAmber(2);
    break;  
    case "signInJasmine":
    changeCircleColorToAmber(3);
    break;
    case "signInMulan":
    changeCircleColorToAmber(4);
    break;         
    }
}

function changeCircleColorToAmber (circleClassIndex) {
    document.querySelectorAll(".circle")[circleClassIndex].style.background = "orange";
}