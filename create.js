var app = require('./app');
var dataSource = app.dataSources.pg;
var Account = app.models.team;
var accounts = [
    { title: "Teamwise"
    }];
console.log("CYKA");
var count = accounts.length;

dataSource.automigrate('team', function (err) {
  accounts.forEach(function(act) {
    Account.create(act, function(err, result) {
      if(!err) {
        console.log('Record created:', result);
        count--;
        if(count === 0) {
          console.log('done');
          dataSource.disconnect();
        }
      }
    });
  });
});
