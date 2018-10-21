$(function () {
    let chatBox = $('#messages');
    let usersBox = $('#usersBox');
    let addMessageInput = $('#addMessage');
    let firstTime = true;
    addMessageInput.keypress(addMessage);

    $('.answerQuestion').on('submit', function () {
        let selectedAnswer = $('input[name="selectedAnswer"]').val();
        selectedAnswer = '#' + selectedAnswer;
        if ($(selectedAnswer).hasClass('correct')) {

            let user = firebase.auth();
            user = user.currentUser.providerData[0];
            let uid = user.uid;
            let database = firebase.database();
            let userToGameRef = database.ref('/userToGame/' + uid);
            userToGameRef.once('value', function (snapshot) {
                try {
                    let userToGameJson = snapshot.toJSON();
                    let gameId = userToGameJson.gameId;
                    gameRef = database.ref('/currentGames/' + gameId);
                    usersRef = gameRef.child('users/');
                    let userRef = usersRef.child(uid + '/');
                    userRef.once('value', function(snapshot){
                        let userJson = snapshot.toJSON();
                        let score = (userJson.score);

                        score++;
                        let userData = {
                            score: score
                        };
                        //userJson.score = score;
                        userRef.update(userData);
                        //console.log(score);
                        let qNum = Math.floor(Math.random() * 2) + 1;
                        console.log(qNum);
                        $('.questionContainer').each(function(){
                            console.log(this.id);
                            if(this.id == 'q' + qNum){
                                console.log('show');
                                $(this).show();
                            } else{
                                console.log('hide');
                                $(this).hide();
                            }
                        })
                    });
                } catch (e) {
                    console.log(e.message);
                    //console.error('error joining game', e.message);
                }
            });
        } else {
            console.log('incorrect');
        }
    });

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

            //console.error('error joining game', e.message);
        }

        //console.log(snapshot);
    });


});

function loadChat(chatRef) {
    chatRef.on('value', function (snapshot) {
        chatBox.html('');
        snapshot.forEach(function (value, key) {
            let chatLine = value.toJSON();
            chatBox.append('<div>' + chatLine + '</div>');
            //console.log(chatLine);
        });
        let messages = $('#messages')[0];
        /*console.log('scrollHeight', messages.scrollHeight);
        console.log('scrollTop', messages.scrollTop);
        console.log('clientHeight', messages.clientHeight);*/
        if (firstTime) {
            messages.scrollTop = messages.scrollHeight;
            firstTime = false;
        } else if (messages.scrollTop + messages.clientHeight + 30 > messages.scrollHeight) {
            messages.scrollTop = messages.scrollHeight;
        }
    });
}

function loadUsers(usersRef) {
    usersRef.on('value', function (snapshot) {
        usersBox.html('');
        $('.slider-wrapper').text('');
        let i = 0;
        snapshot.forEach(function (value, key) {
            let user = value.toJSON();
            let displayName = user.displayName;
            let score = user.score;
            if(score === 30){
                $('.questionContainer').html('GG\'s');
            }
            let piece = user.piece;
            let color;
            let userLocation = user.userLocation;
            //TODO: add score;
            usersBox.append('<div id = "color' + piece + '">' + (piece ? piece : '') + ':' + displayName + ':' + (score ? score : 0) + '</div>');
            $('.slider-wrapper').append('<input min="0" max="30" value="' + score + '" class = "slider" type = "range" id = "rocket' + piece + '"/>');
            i++;

            $('.slider').each(function () {
                console.log(this);
                $(this).attr('draggable', false);
            });
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

