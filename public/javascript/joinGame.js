$(document).on('click', '#playBtn', play);

function play() {
    let user = firebase.auth().currentUser.providerData[0];
    let uid = user.uid;
    let database = firebase.database();
    let gameRef = database.ref('/currentGames/');
    let userToGame = database.ref('/userToGame/' + uid);

    gameRef.once('value', function (snapshot) {
        try {
            if (!snapshot.exists()) {
                createGame();
            } else {
                joinGame(gameRef);
            }
        } catch (e) {
            console.error('error joining game', e.message);
        }
        function joinGame(gameRef){
            gameRef.orderByChild('full').equalTo(false).limitToFirst(1).once('value', function (subSnapshot) {
                let currentGame = subSnapshot.toJSON();
                if(!currentGame){
                    createGame();
                    return null
                }
                let currentGameId = Object.keys(currentGame)[0];
                currentGame = currentGame[currentGameId];
                let currentGameRef = database.ref('/currentGames/' + currentGameId);
                currentGame.numUsers++;
                if (currentGame.numUsers === 6) {
                    currentGame.full = true;
                }
                user.userLocation = 0;
                user.score = 0;
                currentGame.users[uid] = user;
                currentGameRef.set(currentGame);
                userToGame.set({
                    gameId: currentGameId
                });
                window.location.href = 'choosePiece.html';
            });
        }
        function createGame(){
            //createnew
            let newGameData = {
                users: {},
                "private": false,
                createTime: Date.now(),
                full: false,
                numUsers: 1,
                numPlaces: 15
            };

            user.userLocation = 0;
            user.score = 0;
            newGameData.users[uid] = user;
            newGameData.chat = [];
            let createdGameRef = gameRef.push(newGameData);
            userToGame.set({
                gameId: createdGameRef.key
            });

            window.location.href = 'choosePiece.html';
        }
        //console.log(snapshot);
    });
}