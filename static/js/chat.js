/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);


const name = prompt("Username?");


/** called when connection opens, sends join info to server. */

ws.onopen = function(evt) {
  console.log("open", evt);

  let data = {type: "join", name: name};
  ws.send(JSON.stringify(data));
};


/** called when msg received from server; displays it. */

ws.onmessage = function(evt) {
  console.log("message", evt);

  let msg = JSON.parse(evt.data);
  let item;

  if (msg.type === "note") {
    item = $(`<li><i>${msg.text}</i></li>`);
  }

  else if (msg.type === "chat") {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
  }

  else {
    return console.error(`bad message: ${msg}`);
  }

  $('#messages').append(item);
};


/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};


/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};


/** send message when button pushed. */

$('form').submit(function (evt) {
  evt.preventDefault();
  console.log($('#m').val().split(" "))
  const $newArr = $('#m').val().split(" ");
  if($newArr[0] === "/name"){
    let data = {type: "nameChange", new: $newArr[1]}
    ws.send(JSON.stringify(data));
  }else if($newArr[0] === "/priv"){
    const message = $('#m').val().replace(`/priv ${$newArr[1]}`, "")
    let data = {type: "private", to: $newArr[1],text: message}
    ws.send(JSON.stringify(data));
  }else if ($('#m').val() === '/joke'){
    let data = {type: "get-joke"};
    ws.send(JSON.stringify(data));
  }else if ($('#m').val() === '/members'){
    let data = {type: "get-members"};
    ws.send(JSON.stringify(data));
  // }else if ($('#m'.val() === `/priv user message`){
// }
  }else{
    let data = {type: "chat", text: $("#m").val()};
    ws.send(JSON.stringify(data));
  }
  $('#m').val('');
});

