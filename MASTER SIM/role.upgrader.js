module.exports = {
    
    run: function(creep){
        
        if (creep.memory.isHarvesting){
            let containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => structure.structureType == 'container' && structure.store.getUsedCapacity(RESOURCE_ENERGY) >100});
            //console.log(containers);
            if(containers){
                if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(containers);
                }
            }
            else{
                let scrap = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{filter: resource => resource.amount > 50});
            
                if(creep.pickup(scrap) == ERR_NOT_IN_RANGE){
                    creep.moveTo(scrap);
                }
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