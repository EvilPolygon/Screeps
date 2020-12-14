var responsobilities = require('RESPONSOBILITIES');
var autoSpawn = require('autospawn');
var defence = require('mod.defence');
var memoryFiller = require('memory');
var memorySpawns = require('memory.spawns');
var Offense = require('mod.offense');
var production = require('mod.production');

module.exports.loop = function () {
    let mem = Game.cpu.getUsed();
    
    if(Game.cpu.bucket > 9000) {
        Game.cpu.generatePixel();
    }
    Memory.CPUcosts.agregator = 0;
    //console.log(Game.cpu.bucket);
    
    memoryFiller.run(); Memory.CPUcosts['memoryFiller'] = Game.cpu.getUsed() - mem; mem = Game.cpu.getUsed();
    memorySpawns.run(); Memory.CPUcosts['spawns'] = Game.cpu.getUsed() - mem; mem = Game.cpu.getUsed();
    autoSpawn.run();    Memory.CPUcosts['autoSpawn'] = Game.cpu.getUsed() - mem; mem = Game.cpu.getUsed();
    defence.run();      Memory.CPUcosts['defence'] = Game.cpu.getUsed() - mem; mem = Game.cpu.getUsed();
    production.run();   Memory.CPUcosts['production'] = Game.cpu.getUsed() - mem; mem = Game.cpu.getUsed();
    
    
    for (var name in Game.creeps){
        var creep = Game.creeps[name];
        responsobilities.run(creep);
    }Memory.CPUcosts['creeps'] = Game.cpu.getUsed() - mem; mem = Game.cpu.getUsed();
    
    /*if((Memory.offenceINFO.squad).length > 0){
        Offence.run(); break;
    }*/
    Memory.CPUcosts['TOTAL'] = Game.cpu.getUsed();
    console.log('sucses');
}
//that pulled from github
