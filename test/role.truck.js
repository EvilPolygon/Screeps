module.exports = {
run: function(creep){
    
    let scrap = creep.room.find(FIND_DROPPED_RESOURCES);
    
    if(creep.store.getFreeCapacity() == creep.store.getCapacity()){
        if(creep.pickup(scrap[0]) == ERR_NOT_IN_RANGE){
            creep.moveTo(scrap[0]);
        }
    }
    else{
        //console.log('in');
        let storages = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        //console.log(storages);
        if(creep.transfer(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(storages[0]);
        }
    }
}
};