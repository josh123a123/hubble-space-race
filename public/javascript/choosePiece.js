$(document).on('click', '#confirmPieceBtn', confirmPiece);
$(document).on('click', 'img', playSound);

function confirmPiece(){
    var piece = $('input[name=spaceship]:checked').val();
    console.log(piece);
}

function playSound(){
    var audio = document.getElementById("audio");
    audio.play();
}