$(document).ready(function() {
  $("label").click(function(){
    if ($(this).attr("for") != "")
        $("#" + $(this).attr("for")).click();
  });
});