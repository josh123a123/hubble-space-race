$(function () {
    let scoreBox = $('#scoreBox');
    let chatBox = $('#chatBox');
    let usersBox = $('#usersBox');
    let gameRef = null;
    let usersRef = null;
    let chatRef = null;
    let currentGameUserRef = null;
    firebase.auth().onAuthStateChanged(function (user) {
        let currentUser = user.providerData[0];
        let uid = currentUser.uid;
        let database = firebase.database();
        let userToGameRef = database.ref('/userToGame/' + uid);
        userToGameRef.once('value', function (snapshot) {
            try {
                let userToGameJson = snapshot.toJSON();
                let gameId = userToGameJson.gameId;
                gameRef = database.ref('/currentGames/' + gameId);
                usersRef = gameRef.child('users/');
                currentGameUserRef = usersRef.child(uid + '/');
                chatRef = gameRef.child('chat/');
                loadUsers(usersRef);
            } catch (e) {

                console.error('error joining game', e.message);
            }

            //console.log(snapshot);
        });

    });


    function loadChat() {

    }

    function loadScore() {

    }

    function loadUsers(usersRef) {
        usersRef.on('value', function (snapshot) {
            usersBox.html('');
            snapshot.forEach(function (value, key) {
                let user = value.toJSON();
                let displayName = user.displayName;
                let piece = user.piece;
                let userLocation = user.userLocation;
                //TODO: add score;
                usersBox.append('<div>' + displayName + '</div>');

                console.log(value.toJSON());
            });
        });
    }

});
