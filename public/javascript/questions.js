$(document).on("click", ".answer", answerClicked);
$(document).on("submit", ".answerQuestion", confirmAnswerQuestion);

function answerClicked(){
    var self = $(this);
    var parent = self.closest(".questionContainer");
    parent.find("input[name = 'selectedAnswer']").val(self.attr("id"));
    parent.find("img").css('border', '0');
    self.css('border', '3px solid white');
}

function confirmAnswerQuestion(event){
    event.preventDefault();

}