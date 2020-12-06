var responsobilities = require('RESPONSOBILITIES');
var autoSpawn = require('autospawn');
var defence = require('mod.defence');
var utilitycode = require('utility');
var memoryFiller = require('memory');
var memorySpawns = require('memory.spawns');

module.exports.loop = function () {
    
    let mem = Game.cpu.getUsed();
    
    if(Game.cpu.bucket > 9000) {
        Game.cpu.generatePixel();
    }
    
    //console.log(Game.cpu.bucket);
    
    memoryFiller.run(); //Memory.CPUcosts['memoryFiller'] = Game.cpu.getUsed() - mem; mem = Game.cpu.getUsed();
    memorySpawns.run(); //Memory.CPUcosts['spawns'] = Game.cpu.getUsed() - mem; mem = Game.cpu.getUsed();
    autoSpawn.run();    //Memory.CPUcosts['autoSpawn'] = Game.cpu.getUsed() - mem; mem = Game.cpu.getUsed();
    defence.run();      //Memory.CPUcosts['defence'] = Game.cpu.getUsed() - mem; mem = Game.cpu.getUsed();
    utilitycode.run(); // Memory.CPUcosts['utilitycode'] = Game.cpu.getUsed() - mem; mem = Game.cpu.getUsed();
    
    
    for (var name in Game.creeps){
        var creep = Game.creeps[name];
        responsobilities.run(creep);
    }//Memory.CPUcosts['creeps'] = Game.cpu.getUsed() - mem; mem = Game.cpu.getUsed();
    
    
    //Memory.CPUcosts['TOTAL'] = Game.cpu.getUsed();
}