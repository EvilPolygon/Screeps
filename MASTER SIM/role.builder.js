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
                
                let scrap = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{filter: resource => resource.amount > 100});
            
                if(creep.pickup(scrap) == ERR_NOT_IN_RANGE){
                    creep.moveTo(scrap);
                }
                
             if (creep.store.getFreeCapacity() == 0){
                  creep.memory.isHarvesting = false;
                  }
        }
        else {
            
            //---------------здесь начало кода строителя---------------------
            
            let site = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            let walls = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter: structure => (structure.structureType == STRUCTURE_WALL) && (structure.hits<structure.hitsMax)});
            
            
            if((creep.memory.repWalls == 1) && walls){
                if(creep.repair(walls) == ERR_NOT_IN_RANGE){
                    creep.moveTo(walls);
                }
            }
            else{
                if(site){
                    
                    if(creep.build(site) == ERR_NOT_IN_RANGE){
                        creep.moveTo(site);
                    }
                }
                else{
                    let repsite = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => (structure.hits<structure.hitsMax) && !(structure.structureType == STRUCTURE_WALL)
                    });
                    
                    if (repsite){
                        if(creep.repair(repsite) == ERR_NOT_IN_RANGE) {creep.moveTo(repsite);}
                    }
                }
            }
            //---------------здесь конец кода строителя----------------------
            
            if (creep.store.getFreeCapacity() == creep.store.getCapacity()){
                creep.memory.isHarvesting = true;
            }
        }
    }

};