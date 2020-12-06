module.exports = {
    
    run: function(creep){
        
        if (creep.memory.isHarvesting){
            //
            if(creep.store.getFreeCapacity() == 0){
                creep.memory.isHarvesting = false; 
            }
            
            if(creep.room.name == creep.memory.home){
                creep.moveTo(creep.pos.findClosestByPath(creep.room.find(creep.memory.targetRoom)));
            }
            else{
                if(!creep.memory.sourceid){ 
                    let ID = creep.room.find(FIND_SOURCES)
                    creep.memory.sourceid = ID[0].id;
                };
                
                if(creep.harvest(Game.getObjectById(creep.memory.sourceid)) == ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.getObjectById(creep.memory.sourceid).pos);
                }
            }
            
        }
        else{
            
            if(creep.store.getFreeCapacity() == creep.store.getCapacity()){
                creep.memory.isHarvesting = true;
            }
            let newSpawn = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: structure => structure.structureType == STRUCTURE_SPAWN});
            //.log(newSpawn.length);
            if(newSpawn.length >0){
                if(creep.build(newSpawn[0]) == -9){
                    creep.moveTo(newSpawn[0]);
                }
            }
            else{
                let struc = Game.rooms[creep.memory.home].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                }); 
            
                if (struc){
                    if(struc.length >0){
                         if (creep.transfer(struc[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(struc[0]);
                            }
                    }
                    else {
                        creep.moveTo(Game.rooms[creep.memory.home].storage);
                    }
                }
            }
        }
        
    }

};