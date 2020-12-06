var responsobilities = require('RESPONSOBILITIES');
var autoSpawn = require('autospawn');
var defence = require('mod.defence');
var utilitycode = require('utility');
var memoryFiller = require('memory');
var memorySpawns = require('memory.spawns');

module.exports.loop = function () {
    

    
    if(Game.cpu.bucket > 9000) {
        Game.cpu.generatePixel();
    }
    
    //console.log(Game.cpu.bucket);
    
    memoryFiller.run();
    autoSpawn.run();
    defence.run();
    utilitycode.run();
    
    
    for (var name in Game.creeps){
        var creep = Game.creeps[name];
        responsobilities.run(creep);
    }
    
    for (var name in Game.spawns){
        memorySpawns.run(name);
    }
}