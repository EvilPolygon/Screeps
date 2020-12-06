module.exports = {

run: function(creep){
    
    if (creep.store.getFreeCapacity() > 0){
      var target = creep.room.find(FIND_SOURCES);
          if(creep.harvest(target[0]) == ERR_NOT_IN_RANGE){
               creep.moveTo(target[0]);
            }
    }
    else {
        var struc = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        if (struc.length >0){
            if (creep.transfer(struc[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(struc[0]);
            }
        }
        else {
            creep.moveTo(Game.spawns['spawn1'].pos);
        }
    }
}
};