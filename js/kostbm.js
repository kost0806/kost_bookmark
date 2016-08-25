$(document).ready(function() {
	$('#add').bind('click', add_handler);
});

var add_handler = function (e) {
	$('#urlForm').toggle();
}