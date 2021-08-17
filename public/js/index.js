function toggleDeleteBtn(btnId){
    if($(".checkbox." + btnId).is(':checked'))
        $("#" + btnId).show();  // checked
    else
        $("#" + btnId).hide();  // unchecked
}


$(document).ready(function(){
    $('.menu-toggle').click(function(){
      $('.container-switch').toggleClass('active');
      $('#todolist').toggleClass('active');
      $('.createBox').toggleClass('active');
    })
  })