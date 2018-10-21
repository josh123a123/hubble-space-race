$(function () {
    let chatBox = $('#messages');
    let usersBox = $('#usersBox');
    let addMessageInput = $('#addMessage');
    let firstTime = true;
    addMessageInput.keypress(addMessage);

    $('.answerQuestion').on('submit', function () {
        let skipValidation = $("input[name = 'skipValidation']").val();
        let questions = $('.questionContainer');
        let numQuestions = questions.length;
        let nextQuestion = Math.floor(Math.random() * numQuestions);
        nextQuestion = $(questions[nextQuestion]);
        if (skipValidation == 'true') {
            $('.questionContainer').hide();
            nextQuestion.show();
        }
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
                    userRef.once('value', function (snapshot) {
                        let userJson = snapshot.toJSON();
                        let score = (userJson.score);

                        score++;
                        let userData = {
                            score: score
                        };
                        userRef.update(userData);
                        let questions = $('.questionContainer');
                        let numQuestions = questions.length;
                        let nextQuestion = Math.floor(Math.random() * numQuestions);
                        nextQuestion = $(questions[nextQuestion]);
                        if (skipValidation == 'true') {
                            $('.questionContainer').hide();
                            nextQuestion.show();
                        }
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
                loadUsers(usersRef, gameRef);
                loadChat(chatRef);
                endGame(gameRef)
            } catch (e) {

                console.error('error joining game', e.message);
            }
        });


    });

    function endGame(gameRef) {
        gameRef.on('value', function (snapshot) {
            let game = snapshot.toJSON();
            console.log(game);
            if (game.complete) {
                $('.questionContainer').hide('');
                $('#winner').html(game.winner);
                $('#newGame').show();
            }
        });
    }

    function loadChat(chatRef) {
        chatRef.on('value', function (snapshot) {
            chatBox.html('');
            snapshot.forEach(function (value, key) {
                let chatLine = value.toJSON();
                chatBox.append('<div>' + chatLine + '</div>');
                //console.log(chatLine);
            });
            let messages = $('#messages')[0];
            if (firstTime) {
                messages.scrollTop = messages.scrollHeight;
                firstTime = false;
            } else if (messages.scrollTop + messages.clientHeight + 30 > messages.scrollHeight) {
                messages.scrollTop = messages.scrollHeight;
            }
        });
    }

    function loadUsers(usersRef, gameRef) {
        usersRef.on('value', function (snapshot) {
            usersBox.html('');
            $('.slider-wrapper').text('');
            let i = 0;
            snapshot.forEach(function (value, key) {
                let user = value.toJSON();
                let displayName = user.displayName;
                let score = user.score;
                if (score >= 30) {
                    gameRef.update({complete: true, winner: displayName});
                }
                let piece = user.piece;
                let color;
                let userLocation = user.userLocation;
                //TODO: add score;
                usersBox.append('<div id = "color' + piece + '">' + displayName + ':' + (score ? score : 0) + '</div>');
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

