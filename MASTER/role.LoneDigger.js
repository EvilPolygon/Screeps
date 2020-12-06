module.exports = {
    
    run: function(creep){let cp = Game.cpu.getUsed();
    
        if(Game.getObjectById(creep.memory.hSpawnid).memory.for_lonediggers[creep.memory.tRoom] == undefined){
            creep.suicide();
        }
        if(creep.memory.Path.length > 0){
            if(creep.room.name != creep.memory.Path[0].room){
                creep.moveTo(creep.pos.findClosestByPath(creep.memory.Path[0].exit), {reusePath: 30, swampCost: 5});
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
            if(creep.memory.isHarvesting){
                if(creep.memory.tRoom != creep.room.name){
                    if(Game.rooms[creep.memory.tRoom] == undefined){
                        let sp = Game.getObjectById(creep.memory.hSpawnid);
                        if(creep.room.name == sp.room.name){
                            creep.memory.Path = sp.memory.for_lonediggers[creep.memory.tRoom].pathTo;
                        }
                        else{
                            creep.memory.Path = Game.map.findRoute(creep.room.name, creep.memory.tRoom);
                        }
                    }
                    else{
                        creep.moveTo(Game.rooms[creep.memory.tRoom].controller, {reusePath: 30});
                    }
                }
                else{
                    if(creep.getActiveBodyparts('work') == 6 ){
                        if(creep.memory.source_id == false){
                            let sp = Game.getObjectById(creep.memory.hSpawnid);
                            if(sp.memory.for_lonediggers[creep.memory.tRoom].sources.length == 0){
                                let sources = creep.room.find(FIND_SOURCES);
                                for (let i in sources){
                                    sp.memory.for_lonediggers[creep.memory.tRoom].sources.push({id: sources[i].id, sent: false});
                                }
                                creep.memory.source_id = sources[0].id;
                            }
                            else{
                                for(let i in sp.memory.for_lonediggers[creep.memory.tRoom].sources){
                                    if(!sp.memory.for_lonediggers[creep.memory.tRoom].sources[i].sent){
                                        creep.memory.source_id = sp.memory.for_lonediggers[creep.memory.tRoom].sources[i].id;
                                        break;
                                    }
                                }
                            }
                        }
                        else{
                            let src = Game.getObjectById(creep.memory.source_id);
                            if(creep.harvest(src) == -9){
                                creep.moveTo(src, {reusePath: 10});
                            }
                        }
                    }
                    else{
                        let dropsrc = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filetr: s=> s.amount > 650});
                        let ruins = creep.pos.findClosestByPath(FIND_RUINS, {filter: r => r.store.getUsedCapacity() > 0});
                        let tombs = creep.pos.findClosestByPath(FIND_TOMBSTONES, {filter: t => t.store.getUsedCapacity() > 0});
                        
                        
                        
                        if(dropsrc){
                            for (let i in RESOURCES_ALL){
                                if(creep.pickup(dropsrc, RESOURCES_ALL[i]) == -9 ){
                                    creep.moveTo(dropsrc);
                                }
                            }
                        }
                        
                        if(ruins){
                            for (let i in RESOURCES_ALL){
                                if(creep.withdraw(ruins, RESOURCES_ALL[i]) == -9 ){
                                    creep.moveTo(ruins);
                                }
                            }
                        }
                        
                        if(tombs){
                            for (let i in RESOURCES_ALL){
                                if(creep.withdraw(tombs, RESOURCES_ALL[i]) == -9 ){
                                    creep.moveTo(tombs);
                                }
                            }
                        }
                        
                        if(creep.store.getFreeCapacity() == 0){
                            creep.memory.isHarvesting = false;
                        }
                    }
                }
            }
            else{
                let b_road = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: s => s.structureType == 'road'});
                let r_road = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: r => r.structureType == 'road' && r.hitsMax > r.hits});
                creep.build(b_road);
                creep.repair(r_road);
                
                let sp = Game.getObjectById(creep.memory.hSpawnid);
                for(let i in creep.store){
                    if(creep.transfer(sp.room.storage, i) == -9){
                        creep.moveTo(sp.room.storage, {reusePath: 20});
                    }
                }
                
                if(creep.store.getUsedCapacity() == 0){
                    creep.memory.isHarvesting = true;
                }
                
            }
        }
        
        /*if((creep.room.find(FIND_HOSTILE_CREEPS).length > 0 || creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: st => st.structureType == STRUCTURE_INVADER_CORE}).length >0) && creep.room.name != creep.memory.home && creep.memory.Alert <= 0 && (creep.room.controller ? creep.room.controller.reservation.username == 'EvilPolygon' : false)){//console.log(JSON.stringify((Game.rooms[creep.memory.home].find(FIND_MY_SPAWNS))[0].room.name), JSON.stringify((creep.room.find(FIND_HOSTILE_CREEPS))));
            if((Game.rooms[creep.memory.home].find(FIND_MY_SPAWNS))[0].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE], 'LoneDefender' + Game.time, {memory: {Type: 'economical', role: 'defender', Path: Game.map.findRoute(Game.getObjectById(creep.memory.hSpawnid).room.name, creep.room.name)}}) == 0){
                creep.memory.Alert = 750;
            }
        }*/
        
            creep.memory.Alert--;
            Memory.CPUcosts.agregator += Game.cpu.getUsed() - cp;
    }

};























