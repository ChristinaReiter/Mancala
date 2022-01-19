var EventSource = require("eventsource");

const url =
  "http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=alex&game=d6353210d7d2cf9caaad2bcad397fb6c";

var source = new EventSource(url);
source.onmessage = (event) => console.log("event", event);
source.onerror = (error) => console.error("error", error);
