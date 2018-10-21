$(document).on('click', '#confirmPieceBtn', confirmPiece);
$(document).on('click', 'img', playSound);
$(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        disablePieces();
    });
});

function disablePieces() {

    let user = firebase.auth();
    user = user.currentUser.providerData[0];
    let uid = user.uid;
    let database = firebase.database();
    let userToGameRef = database.ref('/userToGame/' + uid);

    userToGameRef.once('value', function (snapshot) {
        try {
            let userToGameJson = snapshot.toJSON();
            let gameId = userToGameJson.gameId;
            database.ref('/currentGames/' + gameId).on("value", function (snapshot) {
                let currentGame = snapshot.toJSON();
                let selectedPieces = currentGame.selectedPieces;
                for (const key in selectedPieces) {
                    if (selectedPieces.hasOwnProperty(key)) {
                        $('#piecesDiv').find('input').filter(function () {
                            if ($(this).val() === selectedPieces[key]) {
                                $(this).closest('label').hide();
                                return true;
                            }
                        });
                    }
                }
            });

        } catch (e) {

            console.error('error gathering data game', e.message);
        }
    });
}

function confirmPiece() {
    var piece = $('input[name=spaceship]:checked').val();

    let user = firebase.auth().currentUser.providerData[0];
    let uid = user.uid;
    let database = firebase.database();
    let userToGameRef = database.ref('/userToGame/' + uid);
    //let gameRef = database.ref('/currentGames/');


    userToGameRef.once('value', function (snapshot) {
        try {
            let userToGameJson = snapshot.toJSON();
            let gameId = userToGameJson.gameId;
            database.ref('/currentGames/' + gameId + '/users/' + uid).update({
                piece: piece
            });
            database.ref('/currentGames/' + gameId + '/selectedPieces').push(piece);

            window.location.href = 'rules.html';
        } catch (e) {

            console.error('error joining game', e.message);
        }

        //console.log(snapshot);
    });


}

function playSound() {
    var audio = document.getElementById("audio");
    audio.play();
}