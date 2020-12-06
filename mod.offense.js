module.exports = {

    run: function (creep) {
        
        if(Memory.offenseINFO[creep.memory.tRoom] == undefined){
            _.forEach(_.filter(Game.creeps, cr => cr.memory.Type == 'offense' && Memory.offenseINFO[creep.memory.tRoom] == undefined), c => c.suicide());
        }

        if (creep.memory.role == 'marauder') {
            
            if (creep.memory.Path.length > 0) {
                if (creep.room.name != creep.memory.Path[0].room) {
                    creep.moveTo(creep.pos.findClosestByPath(creep.memory.Path[0].exit), { reusePath: 20, swampCost: 10});
                }
                else {
                    if (creep.memory.Path.length > 1) {
                        creep.moveTo(creep.pos.findClosestByPath(creep.memory.Path[1].exit));
                        creep.memory.Path.shift();
                    }
                    else {
                        creep.moveTo(creep.room.controller);
                        creep.memory.Path.shift();
                    }
                }
            }
            else {
                if (creep.memory.take) {
                    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: structure =>{
                            return (structure.structureType == 'storage' ||
                                structure.structureType == 'terminal' ||
                                structure.structureType == 'link' ||
                                structure.structureType == 'container') && structure.store.getUsedCapacity() > structure.store.getUsedCapacity('energy');
                    }});
                    let tombs = creep.room.find(FIND_TOMBSTONES, {filter: t=> t.store.getUsedCapacity() > 0});
                    let scrap = creep.room.find(FIND_RUINS, {filter: t=> t.store.getUsedCapacity() > 0});
                    
                    for( let i = 0; i < RESOURCES_ALL.length; i++){
                        if (creep.withdraw(target, RESOURCES_ALL[i]) == -9) {
                            creep.moveTo(target, { reusePath: 10 });
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
                    
                    if(scrap.length > 0){
                        let tscrap = creep.pos.findClosestByPath(scrap);
                        for( let i in RESOURCES_ALL){
                            if (creep.withdraw(tscrap, RESOURCES_ALL[i]) == -9) {
                                creep.moveTo(tscrap, { reusePath: 10 });
                            }
                        }
                    }
                    
                    if(target == null){
                        //Memory.offenseINFO[creep.memory.tRoom].send_marauders = false;
                    }
                    
                    if(creep.room.name != creep.memory.tRoom){
                        creep.memory.take = false;
                    }
                    
                    if (creep.store.getFreeCapacity() == 0) {
                        

                        let min = -1;
                        let room_to;
                        for (let i in Game.rooms) {
                            if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity()){
                                if (Game.rooms[i].storage && Game.rooms[i].controller.my) {
                                    let foo = Game.map.findRoute(creep.room.name, i, {
                                        routeCallback(roomName, fromRoomName){
                                            if(_.find(Memory.offenseINFO[creep.memory.tRoom].avoid_rooms, r => r == roomName)){
                                                return Infinity;
                                            }
                                            else{
                                                return 1;
                                            }
                                        }
                                    });
                                    if (min == -1) {
                                        min = foo.length;
                                        creep.memory.Path = foo;
                                    }
                                    else {
                                        if (min > foo.length) {
                                            min = foo.length;
                                            creep.memory.Path = foo;
                                        }
                                    }
                                }
                            }
                            else{
                                if (Game.rooms[i].terminal && Game.rooms[i].controller.my) {
                                    let foo = Game.map.findRoute(creep.room.name, i, {
                                        routeCallback(roomName, fromRoomName){
                                            if(_.find(Memory.offenseINFO[creep.memory.tRoom].avoid_rooms, r => r == roomName)){
                                                return Infinity;
                                            }
                                            else{
                                                return 1;
                                            }
                                        }
                                    });
                                    if (min == -1) {
                                        min = foo.length;
                                        creep.memory.Path = foo;
                                    }
                                    else {
                                        if (min > foo.length) {
                                            min = foo.length;
                                            creep.memory.Path = foo;
                                        }
                                    }
                                }
                            }
                        }
                        
                            creep.memory.take = false;
                        
                    }
                }
                else {
                    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity()){
                        for (let i in RESOURCES_ALL){
                            if (creep.transfer(creep.room.storage, RESOURCES_ALL[i]) == -9) {
                                creep.moveTo(creep.room.storage);
                            }
                        }
                    }
                    else{
                        for (let i in RESOURCES_ALL){
                            if (creep.transfer(creep.room.storage, RESOURCES_ALL[i]) == -9) {
                                creep.moveTo(creep.room.storage);
                            }
                        }
                    }
                    
                    if (creep.store.getFreeCapacity() == creep.store.getCapacity() && creep.ticksToLive > 750) {
                        creep.memory.Path = Game.map.findRoute(creep.room.name, creep.memory.tRoom,{
                            routeCallback(roomName, fromRoomName){
                                    if(_.find(Memory.offenseINFO[creep.memory.tRoom].avoid_rooms, r => r == roomName)){
                                        return Infinity;
                                    }
                                    else{
                                        return 1;
                                    }
                            }
                        });
                        creep.memory.take = true;
                    }
                    
                    if(creep.memory.Path.length == 0 && creep.store.getUsedCapacity() == 0 && creep.ticksToLive < Memory.offenseINFO[creep.memory.tRoom].info_for_maradeurs.min_live){
                        creep.suicide();
                    }
                    
                }
            }

        }
        else{//---------------------- НАЧАЛО КОДА ДЛЯ ОСТАЛЬНЫХ БОЕВЫХ ЕДИНИЦ -------------------------------------------
            let DANGER = /*creep.room.find(FIND_HOSTILE_CREEPS).length > 0 */ false;
            if(Memory.offenseINFO[creep.memory.tRoom].READY == true){
                creep.memory.ready = true;
            }
        
            if (creep.memory.Path.length > 0 && !DANGER) {
                if (creep.room.name != creep.memory.Path[0].room) {
                    if(creep.memory.Path.length == 1){
                        if(Memory.offenseINFO.READY){
                            creep.memory.ready = true;
                        }
                        if(creep.memory.ready){
                            creep.moveTo(creep.pos.findClosestByPath(creep.memory.Path[0].exit), { reusePath: 20});
                        }
                        else{
                            if(creep.memory.Path[creep.memory.Path.length-1].room == creep.memory.tRoom){
                                let PEx = creep.pos.findClosestByRange(creep.memory.Path[0].exit);
                                if(creep.pos.getRangeTo(PEx) > 2){
                                    creep.moveTo(PEx);
                                }
                            }
                            else{
                                creep.moveTo(creep.pos.findClosestByPath(creep.memory.Path[0].exit), { reusePath: 20});
                            }
                        }
                    }
                    else{
                        creep.moveTo(creep.pos.findClosestByPath(creep.memory.Path[0].exit), { reusePath: 20});
                    }
                }
                else {
                    if (creep.memory.Path.length > 1) {
                        creep.moveTo(creep.pos.findClosestByPath(creep.memory.Path[1].exit));
                        creep.memory.Path.shift();
                    }
                    else {
                        creep.move(creep.memory.Path[0].exit);
                        creep.memory.Path.shift();
                    }
                }
            }
            else{
                if(creep.memory.tRoom != creep.room.name && !DANGER){
                    if(creep.memory.ready){
                        creep.memory.Path = Game.map.findRoute(creep.room.name, creep.memory.tRoom,{
                            routeCallback(roomName, fromRoomName){
                                    if(_.find(Memory.offenseINFO[creep.memory.tRoom].avoid_rooms, r => r == roomName)){
                                        return Infinity;
                                    }
                                    else{
                                        return 1;
                                    }
                            }
                        });
                    }
                    else{
                        if(Memory.offenseINFO[creep.memory.tRoom].Group_room != false){
                            if(Memory.offenseINFO[creep.memory.tRoom].Group_room != creep.room.name){
                                creep.memory.Path = Game.map.findRoute(creep.room.name, Memory.offenseINFO[creep.memory.tRoom].Group_room,{
                                    routeCallback(roomName, fromRoomName){
                                            if(_.find(Memory.offenseINFO[creep.memory.tRoom].avoid_rooms, r => r == roomName)){
                                                return Infinity;
                                            }
                                            else{
                                                return 1;
                                            }
                                    }
                                });
                            }
                            else{
                                creep.memory.Path = Game.map.findRoute(creep.room.name, creep.memory.tRoom,{
                                    routeCallback(roomName, fromRoomName){
                                            if(_.find(Memory.offenseINFO[creep.memory.tRoom].avoid_rooms, r => r == roomName)){
                                                return Infinity;
                                            }
                                            else{
                                                return 1;
                                            }
                                    }
                                });
                            }
                        }
                        else{
                            creep.memory.Path = Game.map.findRoute(creep.room.name, creep.memory.tRoom,{
                                routeCallback(roomName, fromRoomName){
                                        if(_.find(Memory.offenseINFO[creep.memory.tRoom].avoid_rooms, r => r == roomName)){
                                            return Infinity;
                                        }
                                        else{
                                            return 1;
                                        }
                                }
                            });
                            if(creep.memory.Path.length > 1){
                                Memory.offenseINFO[creep.memory.tRoom].Group_room = creep.memory.Path[creep.memory.Path.length - 2].room;
                            }
                            else{
                                Memory.offenseINFO[creep.memory.tRoom].Group_room = creep.room.name;
                            }
                        }
                    }
                }
                else{
                    switch(creep.memory.role){
                        case 'turtle':{
                            creep.moveTo((creep.room.find(FIND_MINERALS))[0]);
                            let InvCORE = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: C=> C.structureType = STRUCTURE_INVADER_CORE});
                            let HosTowers = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: t=> t.structureType == 'tower' && t.store.getUsedCapacity(RESOURCE_ENERGY) > 0});

                            if(HosTowers.length >0){
                                creep.moveTo(HosTowers[0].pos);
                            }
                            
                            if(Memory.offenseINFO[creep.memory.tRoom].pos_for_turtles){
                                creep.moveTo(Memory.offenseINFO[creep.memory.tRoom].pos_for_turtles.x, Memory.offenseINFO[creep.memory.tRoom].pos_for_turtles.y);
                            }
                            //console.log(JSON.stringify(HosTowers));
                            if(HosTowers.length == 0){
                                //Memory.offenseINFO[creep.memory.tRoom].Avangard_send = true;
                                //Memory.offenseINFO[creep.memory.tRoom].Turtles_send = false;
                            }
                            break;
                        }
                        case 'avangard': {
                            let targets = creep.room.find(FIND_HOSTILE_CREEPS);
                            let InvCORE = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: C=> C.structureType = STRUCTURE_INVADER_CORE && C.hits > 0});//console.log(JSON.stringify(InvCORE[0].pos));console.log(JSON.stringify(InvCORE));
                            
                            if(targets.length > 0){
                                let target = creep.pos.findClosestByRange(targets);
                                creep.attack(target);
                                creep.moveTo(target);
                                
                                //Memory.offenseINFO[creep.memory.tRoom].Avangard_send = true;
                            }
                            else{
                                if(targets.length < 3){
                                    //Memory.offenseINFO[creep.memory.tRoom].Dismantlers_send = true;
                                }
                            }
                            if(InvCORE.length>0){
                                creep.attack(InvCORE[0]);
                                creep.moveTo(InvCORE[0].pos);
                            }
                            else{
                                if(InvCORE.length == 0 && targets.length == 0){
                                    //Memory.offenseINFO[creep.memory.tRoom].send_marauders = true;
                                    //Memory.offenseINFO[creep.memory.tRoom].Avangard_send = false;
                                }
                            }
                            
                            if(creep.getActiveBodyparts('heal') > 0){
                                creep.heal(creep);
                            }
                            
                            break;
                        }
                        case 'dismantler':{
                            let tStr = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: T => 
                                T.structureType == 'tower' ||
                                //T.structureType == 'rampart' ||
                                T.structureType == 'extension' ||
                                T.structureType == 'spawn'||
                                T.structureType == 'lab' ||
                                T.structureType == 'nuker'
                            });
                            
                            if(tStr.length > 0){
                                let tar = creep.pos.findClosestByPath(tStr);
                                if(creep.dismantle(tar) == -9){
                                    creep.moveTo(tar);
                                }
                            }
                            else{
                                if(tStr.length < 3){
                                    Memory.offenseINFO[creep.memory.tRoom].send_marauders = true;
                                }
                                if(tStr.length == 0){
                                    //Memory.offenseINFO[creep.memory.tRoom].Dismantlers_send = false;
                                }
                            }
                            if(Memory.offenseINFO[creep.memory.tRoom].prefered_targets.length > 0){
                                let targ = Game.getObjectById(Memory.offenseINFO[creep.memory.tRoom].prefered_targets[0]);
                                if(targ){
                                    if(creep.dismantle(targ) == -9){
                                        creep.moveTo(targ);
                                    }
                                }
                                else{
                                    Memory.offenseINFO[creep.memory.tRoom].prefered_targets.shift();
                                }
                            }
                            
                            break;
                        }
                    }
                }
            }
        }

    }
};






































