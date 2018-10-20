$(document).on('click', '#confirmPieceBtn', confirmPiece);
$(document).on('click', 'img', playSound);

function disablePieces(){
    //TODO: this
}

function confirmPiece(){
    var piece = $('input[name=spaceship]:checked').val();

    let user = firebase.auth().currentUser.providerData[0];
    let uid = user.uid;
    let database = firebase.database();
    let userToGameRef = database.ref('/userToGame/'+uid);
    //let gameRef = database.ref('/currentGames/');


    userToGameRef.once('value', function(snapshot){
        try {
            let userToGameJson = snapshot.toJSON();
            let gameId = userToGameJson.gameId;
            database.ref('/currentGames/' + gameId + '/users/' + uid).update({
                piece: piece
            });
            database.ref('/currentGames/' + gameId+'/selectedPieces').push(piece);

            window.location.href = 'rules.html';
        }catch(e){

            console.error('error joining game', e.message);
        }

        //console.log(snapshot);
    });


}

function playSound(){
    var audio = document.getElementById("audio");
    audio.play();
}