module.exports = {
    
    run: function(creep){
        
        if (creep.memory.isHarvesting){
            let sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(sources[0]);
            }
             if (creep.store.getFreeCapacity() == 0){
                  creep.memory.isHarvesting = false;
                  }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller);
            }
            if (creep.store.getFreeCapacity() == creep.store.getCapacity()){
                creep.memory.isHarvesting = true;
            }
        }
    }
};