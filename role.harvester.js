module.exports = {

run: function(creep){
    
    //let cp = Game.cpu.getUsed();
    
    let Exit =creep.room.find(FIND_EXIT_LEFT);
    
    console.log((Exit));
    if(creep.memory.assigment == ''){
        /*let exitto = creep.room.find(FIND_EXIT_LEFT);
        if (exitto.left.current < exitto.left.need) {creep.memory.assigment = 'left'; creep.memory.Exit = creep.pos.findClosestByPath(creep.room.find(FIND_EXIT_LEFT));}
        if (exitto.top.current < exitto.top.need) {creep.memory.assigment = 'top'; creep.memory.Exit = creep.pos.findClosestByPath(creep.room.find(FIND_EXIT_TOP))}
        if (exitto.right.current < exitto.right.need) {creep.memory.assigment = 'right'; creep.memory.Exit = creep.pos.findClosestByPath(creep.room.find(FIND_EXIT_RIGHT))}
        if (exitto.bottom.current < exitto.bottom.need) {creep.memory.assigment = 'bottom'; creep.memory.Exit = creep.pos.findClosestByPath(creep.room.find(FIND_EXIT_BOTTOM))}
        */
    }
    
    if (creep.memory.isHarvesting){
        
        if(creep.store.getFreeCapacity() == 0){
            creep.memory.isHarvesting = false; 
        }
        
        for (let i in Game.spawns['spawn1'].memory.Info.farSources){//console.log((Game.getObjectById(Game.spawns['spawn1'].memory.Info.farSources[i])));
            if(creep.harvest(Game.getObjectById(Game.spawns['spawn1'].memory.Info.farSources[i])) == ERR_NOT_IN_RANGE){
                creep.moveTo((Game.getObjectById(Game.spawns['spawn1'].memory.Info.farSources[i])).pos);
            }
        else{//console.log(creep.memory.Exit);
            creep.moveTo(creep.pos.findClosestByPath(Exit)); 
        }
        }
    }
    else {
        
        if(creep.store.getFreeCapacity() == creep.store.getCapacity()){
            creep.memory.isHarvesting = true;
        }
        
        var struc = Game.spawns['spawn1'].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        }); 
        
        if (struc){
            if(struc.length >0){
                 if (creep.transfer(struc[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(struc[0]);
                    }
                }
                else {
                    creep.moveTo(Game.spawns['spawn1'].room.storage);
                }
        }
        /*else{
            let Exit = creep.room.find(FIND_EXIT_RIGHT); cosnole.log(creep.room.find(FIND_EXIT_RIGHT));
            creep.moveTo(Exit[0]);
        }*/
    }
    
    //console.log(Game.cpu.getUsed() - cp);
    
}
};