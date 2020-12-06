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
            
            //---------------здесь начало кода строителя---------------------
            
            let site = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(site){
                if(creep.build(site) == ERR_NOT_IN_RANGE){
                    creep.moveTo(site);
                }
            }
            else{
                //сюда нужен код на починку если нечего строить
            }
            
            //---------------здесь конец кода строителя----------------------
            
            if (creep.store.getFreeCapacity() == creep.store.getCapacity()){
                creep.memory.isHarvesting = true;
            }
        }
    }

};