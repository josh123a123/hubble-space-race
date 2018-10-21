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
                loadChat(chatRef);
                loadScore(currentGameUserRef);
            } catch (e) {

                console.error('error joining game', e.message);
            }

            //console.log(snapshot);
        });

    });


    function loadChat(chatRef) {
        chatRef.on('value', function (snapshot) {
            chatBox.html('');
            snapshot.forEach(function (value, key) {
                let chatLine = value.toJSON();
                //TODO: add chat;
                //chatBox.append('<div>' + displayName + '</div>');
                console.log(chatLine);
            });
        });
    }

    function loadScore(usersRef) {
        usersRef.on('value', function (snapshot) {
            scoreBox.html('');
            let user = snapshot.toJSON();
            let displayName = user.displayName;
            let piece = user.piece;
            let userLocation = user.userLocation;
            //TODO: add score;
            scoreBox.append('<div>' + displayName + '</div>');

            console.log(user);
        });
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
