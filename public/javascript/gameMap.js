$(function () {
    let chatBox = $('#messages');
    let usersBox = $('#usersBox');
    let addMessageInput = $('#addMessage');
    addMessageInput.keypress(addMessage);

    let gameRef = null;
    let usersRef = null;
    let chatRef = null;
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
                chatRef = gameRef.child('chat/');
                loadUsers(usersRef);
                loadChat(chatRef);
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
                chatBox.append('<div>' + chatLine + '</div>');
                console.log(chatLine);
            });
        });
    }

    function loadUsers(usersRef) {
        usersRef.on('value', function (snapshot) {
            usersBox.html('');
            snapshot.forEach(function (value, key) {
                let user = value.toJSON();
                let displayName = user.displayName;
                let score = user.score;
                let piece = user.piece;
                let userLocation = user.userLocation;
                //TODO: add score;
                usersBox.append('<div>' + (piece ? piece : '') + ':' + displayName + ':' + (score ? score : 0) + '</div>');

                console.log(value.toJSON());
            });
        });
    }

    function addMessage(event) {
        if (event.keyCode === 13 && addMessageInput.val() !== '') {
            let message = addMessageInput.val();
            chatRef = gameRef.child('chat/');
            chatRef.push(message);
            addMessageInput.val('');
        }
    }

});
