module.exports = {
    
    run: function(creep){
        
        let carry = creep.store.getUsedCapacity() > 0;
        let lab_info = Memory.rooms[creep.room.name].labs;
        
        if(creep.memory.resourc == false){
            for(let i in RESOURCES_ALL){
                if(creep.transfer(creep.room.terminal, RESOURCES_ALL[i]) == -9){
                 creep.moveTo(creep.room.terminal, {range: 4});   
                }
            }
        }
        
        if(!carry){
            creep.memory.resourc = false;
            for(let i in lab_info){
                for(let j in lab_info[i].work_labs){//console.log(JSON.stringify(lab_info[i].work_labs[j]));
                    if(lab_info[i].work_labs[j].aCritical){
                        if(creep.room.terminal.store.getUsedCapacity(lab_info[i].work_labs[j].res) > 0 || creep.room.storage.store.getUsedCapacity(lab_info[i].work_labs[j].res) > 0){
                            creep.memory.resourc = lab_info[i].work_labs[j].res;
                            creep.memory.tlab = lab_info[i].work_labs[j].id;
                        }
                    }
                    else{
                        if(lab_info[i].work_labs[j].eCritical){
                            creep.memory.resourc = 'energy';
                            creep.memory.tlab = lab_info[i].work_labs[j].id;
                        }
                        else{
                            if(creep.memory.labs_for_free.length > 0){
                                let frlab = creep.memory.labs_for_free[0];
                                if(creep.withdraw(frlab, frlab.mineralType) == -9){
                                    creep.moveTo(frlab);
                                }
                                creep.memory.tlab = creep.room.storage.id;
                                creep.memory.resourc = frlab.mineralType;
                            }
                        }
                    }
                }
            }
            
            if(creep.memory.resourc != false){
                let hterm = creep.room.terminal.store.getUsedCapacity(creep.memory.resourc) > 0;
                
                if(hterm){
                    if(creep.withdraw(creep.room.terminal, creep.memory.resourc) == -9){
                        creep.moveTo(creep.room.terminal);
                    }
                }
                else{
                    let hstor = creep.room.storage.store.getUsedCapacity(creep.memory.resourc) > 0;
                    if(hstor){
                        if(creep.withdraw(creep.room.storage, creep.memory.resourc) == -9){
                           creep.moveTo(creep.room.storage);
                        }
                    }
                }
            }
        }
        else{
            let tlab = Game.getObjectById(creep.memory.tlab);
            if(creep.transfer(tlab, creep.memory.resourc) == -9){
                creep.moveTo(tlab);
            }
        }
        
        
        
        if(creep.ticksToLive < 60){
            for(let i in RESOURCES_ALL){
                if(creep.transfer(creep.room.terminal, RESOURCES_ALL[i]) == -9){
                 creep.moveTo(creep.room.terminal);   
                }
            }
            if(creep.store.getUsedCapacity() == 0){
                creep.suicide();
            }
        }
    }
};