$(document).on('click', '#playBtn', play);

function play(){
    let user = firebase.auth().currentUser.providerData[0];
    let database = firebase.database();
    let gameRef = database.ref('/currentGames/');

    gameRef.once('value', function(snapshot){
        try{
            if(!snapshot.exists()){
                //createnew
                let uid = user.uid;
                let newGameData = {
                    users:{},
                    "private" : false,
                    createTime: Date.now(),
                    full : false,
                    numUsers: 1,
                    numPlaces: 15
                };

                let tmpuser = {};
                user.userLocation = 0;
                newGameData.users[uid] = user;
                gameRef.push(newGameData);
                window.location.href = 'choosePiece.html';
            } else{
                snapshot.forEach(function(childSnapshot){
                    console.log(childSnapshot);
                })
            }
        } catch(e){
            console.error('error joining game', e.message);
        }

        //console.log(snapshot);
    });
}