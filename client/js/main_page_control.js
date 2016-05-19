/* Javascript file :: main_page_control */
function open_popup_view(){
  window.open('index.html', 'pop_up',
              'width=840, height=480, toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=no, left=300, top=300');
}

function on_key_down(){
	var keycode = event.keyCode;
	alert(keycode);
};


