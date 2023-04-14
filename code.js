let board = []
for(let a = 0; a < 100; a++) {
  board[a] = [0,0]
}
console.log(board)

let state = 'tile'
let stateRotation = 1
let selected = [];
function drawBoard() {
console.log(board.length)
	for(let i = 0; i < 100; i++) {
  	$('#' + (i+1)).css('background', ``)
    if(board[i][0] == 1) $('#' + (i+1)).css('background-color', '#444')
    else if(board[i][0] == 2) {
    	let deg = "";
      switch(board[i][1]) {
        case 1: // NoRotate
          deg = "90";
          break;
        case 2: // RotateCW
          deg = "180";
          break;
        case 3: // Rotate180
          deg = "270";
          break;
        case 4: // Top
          deg = "0";
          break;
      }
      $('#' + (i+1)).css('background', `linear-gradient(${deg}deg, rgba(2,0,36,1) 19%, rgba(255,255,255,1) 30%, rgba(255,255,255,1) 100%)`)
    }
    else $('#' + (i+1)).css('background-color', '#fff')
  }
}
drawBoard()

$('.block').click(function() {
	let id = this.id; 	
  if(id.length == 1) id='0'+id
  if(state == 'tile'){
    board[parseInt(id)-1] = [1,0]
	}
  else if(state == 'notch'){
    board[parseInt(id)-1] = [2,stateRotation]
  }
  else if(state == 'delete'){
		board[parseInt(id)-1] = [0,0]
	}
  drawBoard()
})

$('.state').click(function() {
	state = this.id
  renderPreview(state, stateRotation)
})

$('#reset').click(function(){
 	state = 'tile'
	for(let i = 0; i < 100; i++) {
    board[i] = [0,0]
    $('#' + i).css('background', ``)
    $('#' + i).css('background-color', '#fff')
    $('#' + i).html('')
  }
  $('#tile').addClass('selc')
  $('#notch').removeClass('selc')
  $('#delete').removeClass('selc')

  stateRotation = 1;
  renderPreview(state, stateRotation)
})

function exportMap(){
	let layoutName = $("#layoutName").val()
	let category = $("#category").val()
  let tiles = "";
  let notches = "";
  let lane = 0;
  for (let i = 0; i < 100; i++) {
    if (i % 10 == 0) {
      lane++
    }
    let x = i % 10;
    let y = lane-1
    
    $('#' + (i+1)).html(`${x}${y}`)
    
    if(board[i][0] == 1) tiles += `${x},${y};`
    if(board[i][0] == 2) {
    	switch(board[i][1]) {
      	case 1: // NoRotate
          notches += `${x-1},${y},${board[i][1]};`
          break;
        case 2: // RotateCW
          notches += `${x},${y-1},${board[i][1]};`
          break;
        case 3: // Rotate180
          notches += `${x+1},${y},${board[i][1]};`
          break;
        case 4: // Top
          notches += `${x},${y+1},${board[i][1]};`
          break;
      }
    }
  }

	const exportedBoard = `${layoutName}|${category}|${tiles}|${notches}`
  
  if(layoutName == "") return "LayoutName is empty."
  if(category  == "") return "Category  is empty."
  if(tiles == "") return "Tiles are empty."
  if(notches == "") return "Notches are empty."
  
  var textArea = document.createElement("textarea");
  textArea.value = exportedBoard;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
  } catch (err) {
    console.log(err)
  }

  document.body.removeChild(textArea);
  return 0;
}
//W|A|0,0;0,1;1,1;2,1;0,2;|3,1,1;
function importMap(map){
	let split = map.split("|")
	let layoutName = split[0]
	let category  = split[1]
  let tiles = split[2].split(";")
  if(tiles[tiles.length-1] == "") tiles.pop()
  let notches = split[3].split(";")
  if(notches[notches.length-1] == "") notches.pop()
  // Above is translated!
  
  let lane = 0;
  for (let i = 0; i < tiles.length; i++) {
    let [x,y] = tiles[i].split(",")
    console.log(`${x} ${y} ${tiles.length}`)
    board[parseInt(`${y}${x}`)] = [1,0]
  } 
  for (let i = 0; i < notches.length; i++) {
  	let [x,y,rot] = notches[i].split(",");
    console.log(`${x} ${y} ${rot} ${notches.length}`)
    board[parseInt(`${y}${x}`)] = [2,parseInt(rot)]
  }
  $("#layoutName").val(layoutName)
  $("#category ").val(category )
  console.log(board)
  drawBoard()
}

$('#importMap').click(function(){
	importMap($("#mapCode").val())
})

$('#exportMap').click(function(){
	let exportmap = exportMap()
	if(exportmap) alert(exportmap);
})

$('button').click(function(){
	if(this.id != 'tile' && this.id != 'notch' && this.id != 'delete') return;
	$('#tile').removeClass('selc')
  $('#notch').removeClass('selc')
  $('#delete').removeClass('selc')

  $('#'+this.id).addClass('selc')
})

window.addEventListener("keydown", (event) => {
	if(event.key == 'r'){
  	stateRotation++
  } else if(event.key == 'R'){
  	stateRotation--
  }
  if(stateRotation > 4) stateRotation = 1;
  if(stateRotation < 1) stateRotation = 4;
  renderPreview(state, stateRotation)
});

function renderPreview(id, rotation) {
	$('#preview').css('background', ``)
	if(id == "tile") $('#preview').css('background-color', '#444')
  else if(id == "notch") {
  	let deg = "";
  	switch(rotation) {
    	case 1: // NoRotate
      	deg = "90";
        break;
      case 2: // RotateCW
      	deg = "180";
        break;
      case 3: // Rotate180
      	deg = "270";
        break;
      case 4: // Top
      	deg = "0";
        break;
    }
  	$('#preview').css('background', `linear-gradient(${deg}deg, rgba(2,0,36,1) 19%, rgba(255,255,255,1) 30%, rgba(255,255,255,1) 100%)`)
  }
}
