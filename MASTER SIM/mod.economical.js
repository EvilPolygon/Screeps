module.exports = {

    run: function(creep){
        
        
        if (creep.memory.role == 'miner'){
            //let target = creep.pos.findClosestByPath(FIND_SOURCES); 
                if(creep.harvest(Game.getObjectById(creep.memory.sourceID)) == ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.getObjectById(creep.memory.sourceID));
                }
        }
        
        if (creep.memory.role == 'truck'){
            
            if(creep.memory.pickingUp == true){
                
            let scrap = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{filter: resource => resource.amount > 75});
            
            if(scrap){
            
                if(creep.pickup(scrap) == ERR_NOT_IN_RANGE){
                    creep.moveTo(scrap);
                }
            }
            else {
                let containers = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
                 filter: (structure) => (
                     structure.structureType == 'container') && 
                     structure.store.getUsedCapacity(RESOURCE_ENERGY) >200}));
            //console.log(containers);
            
                if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(containers);
                }
            }
            
            
                if(creep.store.getFreeCapacity() == 0){
                    creep.memory.pickingUp = false;
                }
            }
            else{
                let storages = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN || 
                            structure.structureType == STRUCTURE_STORAGE) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                            (structure.room.name == creep.room.name);
                    }
                });
                //console.log(storages);
                let nearestSt = creep.pos.findClosestByPath(storages);
                if(creep.transfer(nearestSt, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(nearestSt);
                }
                
                if(creep.store.getCapacity() == creep.store.getFreeCapacity()){
                    creep.memory.pickingUp = true;
                }
                //console.log(storages.length);
                if(storages.length == 0) { creep.moveTo(creep.room.find(FIND_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_SPAWN}));}
                
            }
            
        }
        
        if(creep.memory.role == 'loader'){
            let containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => (structure.structureType == 'container' || structure.structureType == 'storage') && structure.store.getUsedCapacity(RESOURCE_ENERGY) >200});
            //console.log('im ',containers);
            if(creep.memory.pickingUp){
                if(creep.withdraw(containers,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(containers);
                }
                
                if(creep.store.getFreeCapacity() == 0){
                    creep.memory.pickingUp = false;
                }
            }
            else{
                let tow = creep.room.find(FIND_STRUCTURES, {filter: structure => (structure.structureType == STRUCTURE_TOWER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
                //console.log( 'in');
                if(tow[0]){
                    if(creep.transfer(tow[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(tow[0]);                   
                    }
                }
                else{//console.log('double in');
                    creep.moveTo(creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_TOWER}));
                }
                
                if(creep.store.getFreeCapacity() == creep.store.getCapacity()){
                    creep.memory.pickingUp = true;
                }
            }
        }
        
        if(creep.memory.role == 'filler'){
            
            if(creep.memory.isHarvesting){
                
                if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.storage.pos);
                }
                
                if(creep.store.getFreeCapacity() == 0){
                    creep.memory.isHarvesting = false;
                }
                
            }else{
                
                let storages = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                
                if(creep.transfer(storages,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(storages);
                }
                
                if(creep.store.getFreeCapacity() == creep.store.getCapacity()){
                    creep.memory.isHarvesting = true;
                }
            }
        }
        
    }
    
};