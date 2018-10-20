$(function(){
    $(document).on("submit", "#launchGame", launchGame);

    function launchGame(event){
        event.preventDefault();
        location.replace('./launchingIntoSpace.html');
    }

});