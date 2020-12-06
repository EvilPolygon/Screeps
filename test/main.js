var responsobilities = require('RESPONSOBILITIES');
var autoSpawn = require('autospawn');

module.exports.loop = function () {
    
    autoSpawn.run();
    
    
    for (var name in Game.creeps){
        var creep = Game.creeps[name];
        responsobilities.run(creep);
    }
}