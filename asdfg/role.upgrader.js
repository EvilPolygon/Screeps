module.exports = {
    
    run: function(creep){
        if(!creep.memory.work_with_link){
            if (creep.memory.isHarvesting){
                let containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => ((structure.structureType == 'container'  || structure.structureType == STRUCTURE_STORAGE) && structure.store.getUsedCapacity(RESOURCE_ENERGY) >75)});
                //console.log(containers);
                if(containers){
                    if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(containers);
                    }
                }
                else{
                    let scrap = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{filter: resource => resource.amount > 25});
                
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
        else{
            let link = Game.getObjectById(creep.memory.linkID);
            if(creep.pos.getRangeTo(link)>1 || creep.pos.getRangeTo(creep.room.controller) > 3){
                if(creep.pos.getRangeTo(link)>1){
                creep.moveTo(link);
                }
                else{
                    creep.moveTo(creep.room.controller);
                }
            }
            else{
                /*if(creep.memory.isHarvesting){
                    creep.withdraw(link, RESOURCE_ENERGY, (Math.trunc((50 * creep.getActiveBodyparts('carry'))/ creep.getActiveBodyparts('work')) * creep.getActiveBodyparts('work')));
                    creep.memory.isHarvesting = false;
                }
                else{
                    if(creep.upgradeController(creep.room.controller) == -9 ){
                        creep.moveTo(creep.room.controller);
                    }
                    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 ){
                        creep.memory.isHarvesting = true;
                    }
                }*/
                creep.upgradeController(creep.room.controller);
                creep.withdraw(link, RESOURCE_ENERGY, creep.getActiveBodyparts('work'));
            }
        }
        
        if(creep.memory.Boost && !creep.spawning){
            let tlab = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter:  l => l.structureType == STRUCTURE_LAB && (l.mineralType == creep.memory.Boost && l.store.getUsedCapacity(l.mineralType) >= 300 && l.store.getUsedCapacity('energy') >= 300)});
            
            if(tlab && !creep.spawning){
                if(tlab.boostCreep(creep) != 0){
                    creep.moveTo(tlab);
                }
                else{
                    creep.memory.Boost = false;
                }
            }
            else{
                creep.memory.Boost = false;
            }
        }
        
        if(creep.ticksToLive < 150){
            if(creep.memory.boosted == undefined) {creep.memory.boosted = false;}
            if(creep.memory.check == undefined) {creep.memory.check = true;}
            
            if(creep.memory.check){
             for (let i in creep.body){
                    if(creep.body[i].boost){
                        creep.memory.boosted = true;
                        break;
                    }
                }
                creep.memory.check = false;
            }
            
            if(creep.memory.boosted){
                let tlab = creep.pos.findClosestByPath(FIND_STRUCTURES,{filter:  l => l.structureType == STRUCTURE_LAB && l.cooldown == 0});
                
                if(tlab){
                    if(tlab.unboostCreep(creep) != 0){
                        creep.drop('energy');
                        creep.moveTo(tlab);
                    }
                    else{
                        creep.suicide();
                    }
                }
            }
        }
        
    }
};
























