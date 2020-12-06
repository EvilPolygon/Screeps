module.exports = {
    
    run: function(creep){
        
        let carry = creep.store.getUsedCapacity() > 0;
        let lab_info = Memory.rooms[creep.room.name].labs;
        
        creep.moveTo(creep.room.controller, {range: 5, ignoreRoads: true, swampCost: 1});
        
        if(creep.memory.resourc != Object.keys(creep.store)[0] && carry){
            creep.memory.resourc = false;
        }
        
        if(Memory.rooms[creep.room.name].factory){
            const factory = Memory.rooms[creep.room.name].factory;
            if(factory.product.comm){
                const OFactory = Game.getObjectById(factory.id);
                if(factory.product.min_comm <= OFactory.store.getUsedCapacity(factory.product.comm)){
                    if(creep.withdraw(OFactory, factory.product.comm) == -6){
                        creep.moveTo(OFactory);
                    }
                }
                else{
                    creep.moveTo(OFactory);
                }
            }
        }
        
        if(creep.memory.labs_for_free.length > 0){
            let frlab = creep.memory.labs_for_free[0];
            
            if(!carry){
                if(creep.withdraw(frlab, frlab.mineralType) == -9){
                    creep.moveTo(frlab);
                }
            }
        }
        
        if(!carry){
            creep.memory.resourc = false;
            
            if(Memory.rooms[creep.room.name].factory){
                if(Memory.rooms[creep.room.name].factory.product.comm){
                    //let have_that_res_ter = creep.room.terminal.store.getUsedCapacity(lab_info[i].work_labs[j].res) > 5000;
                    //let have_that_res_str = creep.room.storage.store.getUsedCapacity(lab_info[i].work_labs[j].res) > 5000;
                    const factory = Memory.rooms[creep.room.name].factory;
                    
                    for(let i in factory.product.need){
                        if(Game.getObjectById(factory.id).store.getUsedCapacity(i) < factory.product.need[i] * 6){
                            if(creep.room.storage.store.getUsedCapacity(i) > 5000){
                                creep.memory.resourc = i;
                                creep.memory.tlab = factory.id;
                            }
                            
                            if(creep.room.terminal.store.getUsedCapacity(i) > 0){
                                creep.memory.resourc = i;
                                creep.memory.tlab = factory.id;
                            }
                        }
                    }
                    
                }
            }
            
            for(let i in lab_info){
                for(let j in lab_info[i].work_labs){
                
                    let have_that_res = creep.room.terminal.store.getUsedCapacity(lab_info[i].work_labs[j].res) > 0 || creep.room.storage.store.getUsedCapacity(lab_info[i].work_labs[j].res) > 0;
                    
                    if(lab_info[i].work_labs[j].aCritical && have_that_res){
                        creep.memory.resourc = lab_info[i].work_labs[j].res;
                        creep.memory.tlab = lab_info[i].work_labs[j].id;
                        
                    }
                    else{
                        if(lab_info[i].work_labs[j].eCritical){
                            creep.memory.resourc = 'energy';
                            creep.memory.tlab = lab_info[i].work_labs[j].id;
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
                    else{
                        creep.moveTo(Game.getObjectById(creep.memory.tlab));
                    }
                }
                else{
                    let hstor = creep.room.storage.store.getUsedCapacity(creep.memory.resourc) > 0;
                    if(hstor){
                        if(creep.withdraw(creep.room.storage, creep.memory.resourc) == -9){
                           creep.moveTo(creep.room.storage);
                        }
                        else{
                            creep.moveTo(Game.getObjectById(creep.memory.tlab));
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
            
            if(!creep.memory.resourc){
                if(creep.transfer(creep.room.storage, Object.keys(creep.store)[0]) == -9){
                    creep.moveTo(creep.room.storage);
                }
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