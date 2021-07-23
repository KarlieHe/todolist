function toggleDeleteBtn(btnId){
    if($(".checkbox." + btnId).is(':checked'))
        $("#" + btnId).show();  // checked
    else
        $("#" + btnId).hide();  // unchecked
}

