module.exports = {

    run: function(creep){
        
        if(creep.memory.Path.length > 0){
            if(creep.room.name != creep.memory.Path[0].room){
                creep.moveTo(creep.pos.findClosestByPath(creep.memory.Path[0].exit), {reusePath: 30, ignoreCreeps: true});
            }
            else{
                if(creep.memory.Path.length > 1){
                    creep.moveTo(creep.pos.findClosestByPath(creep.memory.Path[1].exit));
                    creep.memory.Path.shift();
                }
                else{
                    creep.moveTo(creep.room.controller);
                    creep.memory.Path.shift();
                }
            }
        }
        else{
            if(creep.memory.Path.length == 0 && creep.room.name != creep.memory.target){
                creep.memory.Path = Game.map.findRoute(creep.room.name, creep.memory.target);
            }
            if( creep.getActiveBodyparts('claim') > 1 ){
                if(creep.memory.forClaim){
                    if(creep.pos.getRangeTo(creep.room.controller) > 1){
                        creep.moveTo(creep.room.controller, {reusePath: 20});
                    }
                    else{
                        if(creep.claimController(creep.room.controller) == -15){
                            creep.reserveController(creep.room.controller);
                        }
                    }
                    
                    for( let i in Memory.claimINFO){
                        if(Memory.claimINFO[i].targetRoom == creep.memory.target){
                            Memory.claimINFO[i].is_my = creep.room.controller.my;
                        }
                    }
                    
                }
                else{
                    if(creep.reserveController(creep.room.controller) == -9){
                        creep.moveTo(creep.room.controller, {reusePath: 30});
                    }
                }
            }
            else{
                if(creep.memory.Harvest){
                    if(creep.memory.src == undefined){
                        creep.memory.src = ((Game.getObjectById((creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)).id)).pos.findClosestByRange(FIND_SOURCES)).id;
                    }
                    else{
                        let src = Game.getObjectById(creep.memory.src);
                        if(creep.harvest(src) == -9){
                            creep.moveTo(src, {reusePath: 30});
                        }
                    }
                    if(creep.store.getFreeCapacity() == 0){
                        creep.memory.Harvest = false;
                    }
                }
                else{
                    if(creep.memory.sp == undefined || creep.memory.sp == null){ //console.log('dsf');
                        creep.memory.sp = (creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)).id;
                    }
                    else{
                        let sp = Game.getObjectById(creep.memory.sp);
                        if(creep.build(sp) == -9){
                            creep.moveTo(sp, {reusePath: 30});
                        }
                    }
                    if(creep.store.getUsedCapacity() == 0){
                        creep.memory.Harvest = true;
                    }
                }
                
                if(creep.room.find(FIND_MY_SPAWNS).length > 0){
                    creep.memory = { Type: 'economical', role: 'miner', sourceID: creep.memory.src , work_with_link: false};
                    for( let i in Memory.claimINFO){
                        if(Memory.claimINFO[i].targetRoom == creep.memory.target){
                            delete Memory.claimINFO[i];
                        }
                    }
                }
            }
        }
    }
};