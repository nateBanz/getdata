import firebase from "firebase";
import fetch from "node-fetch";


const api_url =
    "https://public-api.tracker.gg/v2/overwatch/standard/profile/{platform}/{platformUserIdentifier}";

function initalize () {

    let firebaseConfig = {
        apiKey: "AIzaSyBifKFLyeb5Qm71HtCyJ7LnI7_ot8RPsvE",
        authDomain: "anubis-c9edb.firebaseapp.com",
        databaseURL: "https://anubis-c9edb-default-rtdb.firebaseio.com",
        projectId: "anubis-c9edb",
        storageBucket: "anubis-c9edb.appspot.com",
        messagingSenderId: "745868178409",
        appId: "1:745868178409:web:8e7e26aa3d73d2a5d8d178"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}


const apiDataCollection = (index = 10500)=> {

//filter duplicates
    firebase.database().ref().child("battleTags").orderByKey().limitToLast(20774-index).once("value").then(async function (snapshot){
       let first = snapshot.val();

        let number = 0;
        for(let one in first ) {
            try {

                let ans = first[one];

                number++;
                console.log(number)

                ans = ans.replace(/#/, '-')
                console.log(ans)
                const encodedURI = encodeURI("https://ow-api.com/v1/stats/pc/us/" + ans + "/complete");

                let res = await fetch(encodedURI);
                let data = await res.json()


                if (!data.toString().includes("bad tag") || !data.toString().indexOf("Player not found") || !data.toString().includes("error")){
                    firebase.database().ref().child("dataFromBattleTag").push(data);
                    console.log("done");
                }
                    else{
                    console.log("skipped")
                        }
            }
            catch(error){
                console.log(error, "something went wrong")
                let numbers = number + 2 + 10500
                console.log(numbers)
                if(number === 20774) {
                    process.exit(200)
                }
                else{apiDataCollection(numbers)}



            }

        }
       //first = first.replace(/#/,'-')
        //console.log(first);

    })



}
initalize()
apiDataCollection();
