$(document).on('click', '#playBtn', play);

function play(){
    let user = firebase.auth().currentUser.providerData[0];
    let uid = user.uid;
    let database = firebase.database();
    let gameRef = database.ref('/currentGames/');
    let userToGame = database.ref('/userToGame/'+uid);

    gameRef.once('value', function(snapshot){
        try{
            if(!snapshot.exists()){
                //createnew
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

                let createdGameRef = gameRef.push(newGameData);
                userToGame.set({
                    gameId: createdGameRef.key
                });

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