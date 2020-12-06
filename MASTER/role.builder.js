module.exports = {

    run: function(creep){
        
        if (creep.memory.isHarvesting){
             let containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                 filter: (structure) => (
                     structure.structureType == 'container' || 
                     structure.structureType == 'storage') && 
                     structure.store.getUsedCapacity(RESOURCE_ENERGY) >100});
            //console.log(containers);
            
                if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(containers);
                }
                
                let scrap = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{filter: resource => resource.amount > 100 && resource.resourceType == 'energy'});
            
                if(creep.pickup(scrap) == ERR_NOT_IN_RANGE){
                    creep.moveTo(scrap);
                }
                
                let ruins = creep.pos.findClosestByRange(FIND_RUINS, { filter: t => t.store.getUsedCapacity() > 0 });
                
                if(ruins){
                    for (let i in RESOURCES_ALL){
                        if(creep.withdraw(ruins, RESOURCES_ALL[i]) == -9){
                            creep.moveTo(ruins);
                        }
                    }
                }
                
             if (creep.store.getFreeCapacity() == 0){
                  creep.memory.isHarvesting = false;
                  }
        }
        else {
            
            //---------------здесь начало кода строителя---------------------
            
            let site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            
                if(site){
                    
                    if(creep.build(site) == ERR_NOT_IN_RANGE){
                        creep.moveTo(site);
                    }
                }
                else{
                    if(creep.room.storage){
                        if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == -9){
                            creep.moveTo(creep.room.storage);
                        }
                    }
                    
                    if(creep.store.getUsedCapacity() == 0){
                        creep.suicide();
                    }
                }
            
            //---------------здесь конец кода строителя----------------------
            
            if (creep.store.getFreeCapacity() == creep.store.getCapacity()){
                creep.memory.isHarvesting = true;
            }
        }
    }

};