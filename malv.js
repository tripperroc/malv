if (Meteor.isClient) {
  Meteor.startup(function(){
    Session.set("operation", "showIndex");
  });
  Template.index.showIndex = function(){
    return Session.get("operation") == "showIndex";
  }
  Template.main.showMain = function(){
    return Session.get("operation") == "showMain";
  }
  Template.turing.showTuring = function(){
    return Session.get("operation") == "showTuring";
  }
  
  
}

toIndex = function(){
  Session.set("operation", "showIndex");
}
toMain = function(){
  console.log("to main");
  Session.set("operation", "showMain");
}
toTuring = function(){
  console.log("to turing");
  Session.set("operation", "showTuring");
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

