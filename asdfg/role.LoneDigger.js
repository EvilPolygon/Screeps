module.exports = {
    
    run: function(creep){
        //let cp = Game.cpu.getUsed();
        if (creep.memory.isHarvesting){
            if(creep.store.getFreeCapacity() != null){
                if(creep.store.getFreeCapacity() == 0){
                    creep.memory.isHarvesting = false; 
                }
            }
            
            if(creep.room.name == creep.memory.home){
                if(creep.memory.ExitPosition == undefined || creep.memory.ExitPosition == null){
                    creep.memory.ExitPosition = creep.pos.findClosestByPath(creep.room.find(creep.memory.targetRoom), {ignoreCreeps: true});
                }
                creep.moveTo(creep.memory.ExitPosition.x, creep.memory.ExitPosition.y, {reusePath: 10});
            }
            else{
                if(creep.getActiveBodyparts('work') > 1){
                    if(!creep.memory.sourceid){ 
                        let ID = creep.pos.findClosestByRange(FIND_SOURCES);
                        creep.memory.sourceid = ID.id;
                    };
                    
                    if(creep.harvest(Game.getObjectById(creep.memory.sourceid)) == ERR_NOT_IN_RANGE){
                        creep.moveTo(Game.getObjectById(creep.memory.sourceid).pos, {reusePath: 7});
                    }
                }
                else{
                    let tombs = creep.room.find(FIND_TOMBSTONES, {filter: t=> t.store.getUsedCapacity() > 0});
                    let scrap = creep.room.find(FIND_RUINS, {filter: t=> t.store.getUsedCapacity() > 0});
                    let rdrop = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: r => r.resourceType == 'energy'});
                    
                        if(scrap.length > 0){
                            let tscrap = creep.pos.findClosestByPath(scrap);
                            for( let i in RESOURCES_ALL){
                            if (creep.withdraw(tscrap, RESOURCES_ALL[i]) == -9) {   
                                creep.moveTo(tscrap, { reusePath: 10 }) ;
                                }
                            }
                        }
                        
                        if(tombs.length > 0){
                            let tscrap = creep.pos.findClosestByPath(tombs);
                            for( let i in RESOURCES_ALL){
                                if (creep.withdraw(tscrap, RESOURCES_ALL[i]) == -9) {
                                    creep.moveTo(tscrap, { reusePath: 10 });
                                }
                            }
                        }
                        
                        if(rdrop){
                            if(creep.pickup(rdrop) == -9){
                                creep.moveTo(rdrop);
                            }
                        }
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
                    creep.moveTo(newSpawn[0], {reusePath: 50});
                }
            }
            else{
                    let b_road = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: s => s.structureType == 'road'});
                    let r_road = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: r => r.structureType == 'road' && r.hitsMax > r.hits});
                    creep.build(b_road);
                    creep.repair(r_road);
                    
                    let struc = Game.rooms[creep.memory.home].find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    }); 
                
                    if (struc){
                        if(struc.length >0){
                             if (struc[0].room.name != creep.room.name) {
                                    creep.moveTo(struc[0], {reusePath: 10});
                                }
                                else{
                                    let closest = creep.pos.findClosestByPath(struc);
                                    if(creep.transfer(closest, RESOURCE_ENERGY) == -9){
                                        creep.moveTo(closest, {reusePath: 10, ignoreCreeps: true})
                                    }
                                }
                        }
                        else {
                            creep.moveTo(Game.rooms[creep.memory.home].storage, {reusePath: 50});
                        }
                    }
                
            }
        }
        
        if((creep.room.find(FIND_HOSTILE_CREEPS).length > 0 || creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: st => st.structureType == STRUCTURE_INVADER_CORE}).length >0) && creep.room.name != creep.memory.home && creep.memory.Alert <= 0){//console.log(JSON.stringify((Game.rooms[creep.memory.home].find(FIND_MY_SPAWNS))[0].room.name), JSON.stringify((creep.room.find(FIND_HOSTILE_CREEPS))));
            if((Game.rooms[creep.memory.home].find(FIND_MY_SPAWNS))[0].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE], 'LoneDefender' + Game.time, {memory: {role: 'defender', ex: Game.map.findExit(creep.memory.home, creep.room.name), home: creep.memory.home}}) == 0){
                creep.memory.Alert = 2000;
            }
        }
        
            creep.memory.Alert--;
        
        
    }

};