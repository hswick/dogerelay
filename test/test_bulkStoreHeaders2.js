var fs = require('fs');
var readline = require('readline');
var DogeRelay = artifacts.require("./DogeRelay.sol");


contract('DogeRelay', function(accounts) {
 it("testDifficulty", function() {
    var dr;    
    var blocks = "0x";
    return DogeRelay.deployed().then(function(instance) {      
      dr = instance;
      return dr.setInitialParent(0, 0, 1, {from: accounts[0]}); 
    }).then(
      function(result) {
        return new Promise((resolve, reject) => {
          var lineReader = readline.createInterface({
            input: fs.createReadStream('test/headers/firstEleven.txt')
          });
          lineReader.on('line', function (line) {
            blocks += line;
          });
          lineReader.on('close', function () {
            dr.bulkStoreHeaders(blocks, 11, {from: accounts[0]}).then(resolve);  
          });
        });
      }
    ).then(function(result) {
      return dr.getChainWork.call();
    }).then(function(result) {
      assert.equal(result.toNumber(), 11 + 1, "difficulty is not the expected one"); // # +1 since setInitialParent was called with imaginary block
      return dr.getAverageChainWork.call();
    }).then(function(result) {
      assert.equal(result.toNumber(), 10, "average chain work is not the expected one");
    });
  });


});
