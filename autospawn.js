module.exports = {

    run: function () {

        if (Memory.Economical_Report.donor_programm) {
            let donor_room = { from: '', to: '' };
            let max = 0;
            for (let i in Game.rooms) {
                let buf = (Game.rooms[i].storage != undefined ? Game.rooms[i].storage.store.getUsedCapacity(RESOURCE_ENERGY) : 0) +
                    (Game.rooms[i].terminal != undefined ? Game.rooms[i].terminal.store.getUsedCapacity(RESOURCE_ENERGY) : 0);
                if (max < buf) {
                    max = buf;
                    donor_room.from = i;
                }
            }

            let targetR = Memory.Economical_Report.Rooms;
            for (let i in targetR) {
                if (Game.rooms[i].terminal == undefined && targetR[i].currAmount < 10000 && targetR[i].donor_sent == false) {
                    let donor_spawn = Game.rooms[donor_room.from].find(FIND_MY_SPAWNS)[0];
                    if (donor_spawn != undefined) {
                        donor_spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                            'Donor' + Game.time, { memory: { Type: 'economical', role: 'donor', from: donor_room.from, to: i, Harvest: true, Path: [] } });
                        targetR[i].donor_sent = true;
                    }
                }
            }

        }

        for (let i in Game.rooms) {
            //console.log(i);
            let SPAWN = Game.rooms[i].find(FIND_MY_SPAWNS);

            if (SPAWN[0]) {
                //console.log( 'ROOM IS' ,SPAWN[0].room.name);
                //записываем в info текущее количество рабочих

                SPAWN[0].memory.Info.workers.LoneDiggers = (_.filter(Game.creeps, (creep) => (creep.memory.role == 'LoneDigger') && (creep.memory.home == SPAWN[0].room.name))).length;
                SPAWN[0].memory.Info.workers.upgraders = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'upgrader' }))).length;
                SPAWN[0].memory.Info.workers.builders = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'builder' }))).length;
                SPAWN[0].memory.Info.workers.economical.truck = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'truck' }))).length;
                SPAWN[0].memory.Info.workers.economical.miner = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'miner' }))).length;
                SPAWN[0].memory.Info.workers.loaders = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'loader' }))).length;
                SPAWN[0].memory.Info.workers.foreman = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'foreman' }))).length;
                SPAWN[0].memory.Info.workers.economical.Filler = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'filler' }))).length;
                SPAWN[0].memory.Info.workers.economical.operator = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'operator' }))).length;
                SPAWN[0].memory.Info.workers.economical.for_extractors.extractors = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'extractor' }))).length;
                SPAWN[0].memory.Info.workers.economical.for_extractors.taker = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'taker' }))).length;
                
                for(let sp in SPAWN){
                    if(SPAWN[sp].spawning){
                        SPAWN[0].memory.Info.workers.LoneDiggers += Game.creeps[Game.spawns[SPAWN[sp].name].spawning.name].memory.role == 'LoneDigger' ? 1 : 0 ;
                        SPAWN[0].memory.Info.workers.upgraders += Game.creeps[Game.spawns[SPAWN[sp].name].spawning.name].memory.role == 'upgrader' ? 1 : 0;
                        SPAWN[0].memory.Info.workers.builders += Game.creeps[Game.spawns[SPAWN[sp].name].spawning.name].memory.role == 'builder' ? 1 : 0;
                        SPAWN[0].memory.Info.workers.economical.truck += Game.creeps[Game.spawns[SPAWN[sp].name].spawning.name].memory.role == 'truck' ? 1 : 0;
                        SPAWN[0].memory.Info.workers.economical.miner += Game.creeps[Game.spawns[SPAWN[sp].name].spawning.name].memory.role == 'miner' ? 1 : 0;
                        SPAWN[0].memory.Info.workers.loaders += Game.creeps[Game.spawns[SPAWN[sp].name].spawning.name].memory.role == 'loader' ? 1 : 0;
                        SPAWN[0].memory.Info.workers.foreman += Game.creeps[Game.spawns[SPAWN[sp].name].spawning.name].memory.role == 'foreman' ? 1 : 0;
                        SPAWN[0].memory.Info.workers.economical.Filler += Game.creeps[Game.spawns[SPAWN[sp].name].spawning.name].memory.role == 'filler' ? 1 : 0;
                        SPAWN[0].memory.Info.workers.economical.operator += Game.creeps[Game.spawns[SPAWN[sp].name].spawning.name].memory.role == 'operator' ? 1 : 0;
                        SPAWN[0].memory.Info.workers.economical.for_extractors.extractors += Game.creeps[Game.spawns[SPAWN[sp].name].spawning.name].memory.role == 'extractor' ? 1 : 0;
                        SPAWN[0].memory.Info.workers.economical.for_extractors.taker += Game.creeps[Game.spawns[SPAWN[sp].name].spawning.name].memory.role == 'taker' ? 1 : 0;
                    }
                }

                //----------------- Автоназначение количества крипов----------------
                
                if(Memory.rooms[SPAWN[0].room.name].labs){
                    if(SPAWN[0].memory.workers.foreman == undefined){
                        SPAWN[0].memory.workers.foreman = 1;
                    }
                }
                
                let ext = SPAWN[0].room.find(FIND_STRUCTURES, {filter: s=> s.structureType == 'extractor'});
                if(ext.length > 0){
                    let m = SPAWN[0].room.find(FIND_MINERALS);
                    
                    if(SPAWN[0].memory.Info.workers.economical.for_extractors.mineralID == undefined){
                        SPAWN[0].memory.Info.workers.economical.for_extractors.mineralID = m[0].id;
                    }
                }
                
                
                if(SPAWN[0].room.storage && SPAWN[0].room.storage.my){
                    SPAWN[0].memory.workers.economical.Filler = 1;
                }
                
                if (Game.rooms[SPAWN[0].room.name].memory.links) {
                    SPAWN[0].memory.workers.economical.operator = 1;
                }

                let sites = SPAWN[0].room.find(FIND_CONSTRUCTION_SITES);
                if (sites.length > 0) {
                    SPAWN[0].memory.workers.builders = Math.trunc((sites.length) / 6) + 2;
                    if (SPAWN[0].memory.workers.builders > 3) {
                        SPAWN[0].memory.workers.builders = 3;
                    }
                }
                else {
                    SPAWN[0].memory.workers.builders = 0;
                }
                //-------------------------------------------------------------------
                
                
                SPAWN[0].memory.Info.offense.ticks--;

                //if (SPAWN[0].memory.Info.offense.claimers > 0) { SPAWN[0].memory.offense.claimers = 0; }
                //console.log(Game.rooms['W22N1'].controller.safeMode);

                for (let sp in SPAWN) {
                    

                    if (!SPAWN[sp].spawning) {

                        let Gmem = SPAWN[0].memory;

                        
        //--------------------------------------------- КОД ДЛЯ АТАКУЮЩИХ КРИПОВ -------------------------------
                        
                        let Ainfo = Memory.offenseINFO;
                        if(Object.keys(Ainfo).length > 0){
                            for (let a in Ainfo){
                                // && Game.map.findRoute(SPAWN[sp].room.name, a).length < 4
                                if(Ainfo[a].Dismantlers_send && Game.map.findRoute(SPAWN[sp].room.name, a).length <= Ainfo[a].max_range_from_spawn){
                                    if(_.filter(Game.creeps, cr=> cr.memory.role == 'dismantler' && cr.memory.tRoom == a).length < Ainfo[a].needed_Dismantlers){
                                        let parts = [];
                                        for (let p = 0 ; p < 10; p++){
                                            parts.push('work');
                                            parts.push('move');
                                        }
                                        SPAWN[sp].spawnCreep(parts, 'Dismantler' + Game.time, {memory:{Type:'offense', role: 'dismantler', ready:false, Path:[], tRoom: a}})
                                    }
                                }
                                
                                if(Ainfo[a].Avangard_send && Game.map.findRoute(SPAWN[sp].room.name, a).length <= Ainfo[a].max_range_from_spawn){
                                    if(_.filter(Game.creeps, cr=> cr.memory.role == 'avangard' && cr.memory.tRoom == a).length < Ainfo[a].needed_Avangard){
                                        let parts = [];
                                        for (let p = 0 ; p < 25; p++){
                                            if(p<4){
                                                parts.push('tough');
                                                parts.push('move');
                                            }
                                            else{
                                                if(p != 24){
                                                    parts.push('attack');
                                                    parts.push('move');
                                                }
                                                else{
                                                    parts.push('heal');
                                                    parts.push('move');
                                                }
                                            }
                                        }
                                        SPAWN[sp].spawnCreep(parts, 'Avangard' + Game.time, {memory:{Type:'offense', role: 'avangard', ready:false, Path:[], tRoom: a}})
                                    }
                                }
                                
                                if(Ainfo[a].Turtles_send && Game.map.findRoute(SPAWN[sp].room.name, a).length <= Ainfo[a].max_range_from_spawn){
                                    if(_.filter(Game.creeps, cr=> cr.memory.role == 'turtle' && cr.memory.tRoom == a).length < Ainfo[a].needed_Turtles){
                                        let parts = [];
                                        for (let p = 0 ; p < 50; p++){
                                            if(p<30){
                                                parts.push('tough');
                                            }
                                            else{
                                                parts.push('move');
                                            }
                                        }
                                        SPAWN[sp].spawnCreep(parts, 'Turtle' + Game.time, {memory:{Type:'offense', role: 'turtle', ready:false, Path:[], tRoom: a}})
                                    }
                                }
                                
                                if(Ainfo[a].send_marauders && Game.map.findRoute(SPAWN[sp].room.name, a).length <= Ainfo[a].max_range_from_spawn){//---- MARAUDERS-----
                                    if(_.filter(Game.creeps, creep => creep.memory.role == 'marauder').length < Ainfo[a].info_for_maradeurs.needed_marauders){
                                        let parts = [];
                                        for (let j = 0 ; j<25; j++){
                                            parts.push('carry');
                                            parts.push('move');
                                        }
                                        SPAWN[sp].spawnCreep(parts, 'Marauder' + Game.time, {memory: {Type: 'offense', role: 'marauder', Path:[], take: false, tRoom: a}});
                                    }
                                }
                                
                            }
                        }
                        
        //--------------------------------------------------------------------------------------------------------
                        
                        let targetRooms = Memory.claimINFO;
                        if (targetRooms.length > 0 && targetRooms[0] != null) {
                            for (let i in targetRooms) {

                                if (!targetRooms[i].liveClaimer  && targetRooms[i].targetRoom && (Game.map.findRoute(SPAWN[sp].room.name, targetRooms[i].targetRoom).length == 1 || targetRooms[i].far) && SPAWN[sp].room.controller.level > 3) {
                                    if(targetRooms[i].far != undefined && targetRooms[i].far != false && SPAWN[sp].room.name != targetRooms[i].far) {continue; }
                                    if (targetRooms[i].is_my == undefined || targetRooms[i].is_my == false) {
                                        SPAWN[sp].spawnCreep(
                                            [MOVE, MOVE, CLAIM, CLAIM],
                                            'Claimer' + Game.time,
                                            {
                                                memory: {
                                                    role: 'claimer',
                                                    target: targetRooms[i].targetRoom,
                                                    Path: Game.map.findRoute(SPAWN[sp].room.name,
                                                        targetRooms[i].targetRoom, {
                                                            routeCallback(roomName, fromRoomName){
                                                                if(_.find(targetRooms[i].avoid_rooms, r => r == roomName)){
                                                                    return Infinity;
                                                                }
                                                                else{
                                                                    return 1;
                                                                }
                                                        }
                                                        }),
                                                    forClaim: targetRooms[i].forClaim
                                                }
                                            });
                                        //console.log('In room', SPAWN[sp].room.name, 'spawning claimer!');
                                        targetRooms[i].liveClaimer = true;
                                    }
                                    else {
                                        SPAWN[sp].spawnCreep(
                                            [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK],
                                            'Claimer' + Game.time,
                                            {
                                                memory: {
                                                    role: 'claimer',
                                                    target: targetRooms[i].targetRoom,
                                                    Path: Game.map.findRoute(SPAWN[sp].room.name,
                                                        targetRooms[i].targetRoom, {
                                                            routeCallback(roomName, fromRoomName){
                                                                if(_.find(targetRooms[i].avoid_rooms, r => r == roomName)){
                                                                    return Infinity;
                                                                }
                                                                else{
                                                                    return 1;
                                                                }
                                                        }
                                                        }),
                                                    forClaim: targetRooms[i].forClaim,
                                                    Harvest: true
                                                }
                                            });
                                        console.log('In room', SPAWN[sp].room.name, 'spawning builder for claimed room!');
                                        targetRooms[i].liveClaimer = true;
                                    }
                                }
                            }
                        }
        //---------------------------------------------------------------------------------------------------------                
                    let minID = SPAWN[0].memory.Info.workers.economical.for_extractors.mineralID;
                    if(minID != undefined){
                        if(Game.getObjectById(minID).ticksToRegeneration == undefined){
                            if(SPAWN[0].memory.Info.workers.economical.for_extractors.taker < SPAWN[0].memory.workers.economical.for_extractors.taker){
                                SPAWN[sp].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],'Taker' + Game.time, {memory:{Type: 'economical', role: 'taker'}});
                                SPAWN[0].memory.Info.workers.economical.for_extractors.extractors++;
                            }
                            
                            if(SPAWN[0].memory.Info.workers.economical.for_extractors.extractors < SPAWN[0].memory.workers.economical.for_extractors.extractors){
                                SPAWN[sp].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],'Extractor' + Game.time, {memory:{Type: 'economical', role: 'extractor', mineralID: SPAWN[0].memory.Info.workers.economical.for_extractors.mineralID}});
                                SPAWN[0].memory.Info.workers.economical.for_extractors.extractors++;
                            }
                        }
                    }
                    
                        for (let Role in Gmem.workers) {

                            //console.log(Role);

                            if (Gmem.Info.workers[Role] < Gmem.workers[Role]) {
                                switch (Role) {
                                    
                                    case 'foreman':{
                                        SPAWN[sp].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 'Foreman' + Game.time, {memory: {role: 'foreman'}});
                                        SPAWN[0].memory.Info.workers.foreman++;
                                        break;
                                    }

                                    case 'loaders':
                                        SPAWN[sp].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'Loader' + Game.time, { memory: { Type: 'economical', role: 'loader', pickingUp: true } });
                                        SPAWN[0].memory.Info.workers.loaders++;
                                        break;

                                    case 'builders': {

                                        if (SPAWN[0].room.controller.level <= 3) {
                                            SPAWN[sp].spawnCreep([WORK, CARRY, MOVE, CARRY, MOVE], 'Builder' + Game.time, { memory: { role: 'builder', isHarvesting: true } });
                                        } else {
                                            SPAWN[sp].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'Builder' + Game.time, { memory: { role: 'builder', isHarvesting: true, repWalls: 0 } });
                                        }
                                        SPAWN[0].memory.Info.workers.builders++;
                                        break;
                                    }
                                    case 'upgraders': {
                                        if (Game.rooms[SPAWN[0].room.name].memory.links != undefined) {
                                            if(_.find(Game.rooms[SPAWN[0].room.name].memory.links, { linkType: 'controller' }) && _.find(Game.rooms[SPAWN[0].room.name].memory.links, { linkType: 'storage' })){
                                            var linkControll = _.find(Game.rooms[SPAWN[0].room.name].memory.links, { linkType: 'controller' });
                                            let parts = ['carry'];
                                            let cparts = Math.trunc((Game.rooms[i].energyCapacityAvailable - 50) / 350);

                                            for (let np = 1; np < cparts + 1; np++) {
                                                parts.push('work');
                                                parts.push('work');
                                                parts.push('work');
                                                parts.push('move');
                                                if (np > 2 && Object.keys(SPAWN[0].memory.Info.sources).length == 1) {
                                                    break;
                                                }
                                                if (np > 2) {
                                                    break;
                                                }
                                            }
                                            if(parts.length > 1){
                                                SPAWN[sp].spawnCreep(parts, 'Upgrader' + Game.time, { memory: { role: 'upgrader', isHarvesting: true, work_with_link: true, linkID: linkControll.id, Boost: 'XGH2O'} });
                                            }
                                            }
                                            else{
                                                let Cparts = Math.trunc(Game.rooms[i].energyCapacityAvailable / 300);
                                            if (Cparts > 0) {//console.log('in');
                                                let parts = [];
                                                for (let Np = 0; Np < Cparts; Np++) {
                                                    parts.push('work');
                                                    parts.push('move');
                                                    parts.push('move');
                                                    parts.push('carry');
                                                    parts.push('carry');
                                                }

                                                SPAWN[sp].spawnCreep(parts, 'Upgrader' + Game.time, { memory: { role: 'upgrader', isHarvesting: true, work_with_link: false } });
                                            }
                                            }
                                        }
                                        else {
                                            let Cparts = Math.trunc(Game.rooms[i].energyCapacityAvailable / 300);
                                            if (Cparts > 0) {//console.log('in');
                                                let parts = [];
                                                for (let Np = 0; Np < Cparts; Np++) {
                                                    parts.push('work');
                                                    parts.push('move');
                                                    parts.push('move');
                                                    parts.push('carry');
                                                    parts.push('carry');
                                                }

                                                SPAWN[sp].spawnCreep(parts, 'Upgrader' + Game.time, { memory: { role: 'upgrader', isHarvesting: true, work_with_link: false } });
                                            }
                                        }
                                        SPAWN[0].memory.Info.workers.upgraders++;
                                        break;

                                    }

                                    case 'LoneDiggers': { //-------------  КОД ДЛЯ ДАЛЬНИХ ДОБЫТЧИКОВ -----------------------------------------------------------------------------------------------------------------------------
                                        for (let i in SPAWN[0].memory.for_lonediggers){
                                            if(SPAWN[0].memory.for_lonediggers[i].sources.length > 0){
                                                SPAWN[0].memory.for_lonediggers[i].need = SPAWN[0].memory.for_lonediggers[i].sources.length * 3;
                                                if(_.filter(Game.creeps, c => c.memory.role == 'LoneDigger' && c.memory.tRoom == i).length < SPAWN[0].memory.for_lonediggers[i].need){
                                                    let parts = [];
                                                    for(let j = 0; j<21; j++){
                                                        if(j == 0){
                                                            parts.push('work');
                                                        }else{
                                                            if(j >= 14){
                                                                parts.push('move')
                                                            }
                                                            else{
                                                                parts.push('carry');
                                                            }
                                                        }
                                                    }
                                                    let send_miner = false;
                                                    for( let j in SPAWN[0].memory.for_lonediggers[i].sources){
                                                        if(SPAWN[0].memory.for_lonediggers[i].sources[j].sent == false){
                                                            send_miner = SPAWN[0].memory.for_lonediggers[i].sources[j].id;
                                                        }
                                                    }
                                                    if(send_miner){
                                                        SPAWN[sp].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], 'LoneDigger' + Game.time, {memory: {role: 'LoneDigger', Path:[], source_id: send_miner, tRoom: i, hSpawnid: SPAWN[0].id, isHarvesting: true, Alert: 0}});
                                                    }
                                                    else{
                                                        SPAWN[sp].spawnCreep(parts, 'LoneDigger' + Game.time, {memory:{role: 'LoneDigger', Path:[], source_id: false, tRoom: i, hSpawnid: SPAWN[0].id, isHarvesting: true, Alert: 0}});
                                                    }
                                                }
                                            }
                                            else{
                                                SPAWN[0].memory.for_lonediggers[i].need = 1;
                                                if(_.filter(Game.creeps, c => c.memory.role == 'LoneDigger' && c.memory.tRoom == i).length < SPAWN[0].memory.for_lonediggers[i].need){
                                                    SPAWN[sp].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], 'LoneDigger' + Game.time, {memory:{role: 'LoneDigger', Path:[], source_id: false, tRoom: i, hSpawnid: SPAWN[0].id, isHarvesting: true, Alert: 0}});
                                                }
                                            }
                                        }
                                        break;
                                    }
                                }

                            }
                        }

                        let Ecomem = SPAWN[0].memory.workers.economical;

                        for (let Eco in Ecomem) {
                            //console.log(Gmem.Info.workers.economical[Eco] < Ecomem[Eco], Gmem.Info.workers.economical[Eco], Ecomem[Eco], Eco, SPAWN[0].room.name);
                            if (Gmem.Info.workers.economical[Eco] < Ecomem[Eco]) {//console.log(Eco);
                                switch (Eco) {
                                    case 'operator': {
                                        if (SPAWN[sp].room.terminal == undefined) {
                                            SPAWN[sp].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE], 'Operator' + Game.time, { memory: { Type: 'economical', role: 'operator', moving: true, linkID: _.find(Game.rooms[SPAWN[0].room.name].memory.links, { linkType: 'storage' }) } });
                                        }
                                        else {
                                            SPAWN[sp].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], 'Operator' + Game.time, { memory: { Type: 'economical', role: 'operator', moving: true, linkID: _.find(Game.rooms[SPAWN[0].room.name].memory.links, { linkType: 'storage' }) } });
                                        }
                                        SPAWN[0].memory.Info.workers.economical.operator++;
                                        break;
                                    }
                                    case 'truck': {
                                        SPAWN[sp].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'Truck' + Game.time, { memory: { Type: 'economical', role: 'truck', pickingUp: true } });
                                        SPAWN[0].memory.Info.workers.economical.truck++;
                                        break;
                                    }

                                    case 'miner': {
                                        if (Gmem.Info.workers.economical.miner == 0 || Ecomem.truck <= Gmem.Info.workers.economical.truck) {
                                            let haveSrcLink = _.filter(Game.rooms['W23N1'].memory.links, { 'linkType': 'source' });

                                            let sou = SPAWN[0].memory.Info.sources;

                                            for (let i in sou) {//console.log('in', SPAWN[0].room.name);

                                                if (sou[i].currMiners < sou[i].spots) {//console.log(SPAWN[0].room.energyAvailable + ( SPAWN[0].room.storage != undefined ? SPAWN[0].room.storage.store.getUsedCapacity(RESOURCE_ENERGY) : 0), SPAWN[0].room.name);
                                                    if (Game.rooms[SPAWN[0].room.name].memory.links) {
                                                        var linkSource = _.find(Game.rooms[SPAWN[0].room.name].memory.links, { sourceID: sou[i].ID });

                                                        if (linkSource != undefined) {//console.log(Game.rooms[SPAWN[0].room.name].energyAvailable > 750 , Number(Game.rooms[SPAWN[0].room.name].storage.store.getUsedCapacity(RESOURCE_ENERGY)) > 750 && SPAWN[0].memory.Info.workers.economical.Filler >= 1);
                                                            if (Game.rooms[SPAWN[0].room.name].energyAvailable > 750 || Number(Game.rooms[SPAWN[0].room.name].storage.store.getUsedCapacity(RESOURCE_ENERGY)) > 750 && SPAWN[0].memory.Info.workers.economical.Filler >= 1 || SPAWN[0].memory.Info.workers.economical.miner >= 1) {
                                                                SPAWN[sp].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], 'Miner' + Game.time, { memory: { Type: 'economical', role: 'miner', sourceID: sou[i].ID, work_with_link: true, linkID: linkSource.id } });
                                                                sou[i].spots = 1;
                                                            }
                                                            else {
                                                                if (Game.rooms[SPAWN[0].room.name].energyAvailable > 700) {
                                                                    sou[i].spots = 1;
                                                                    SPAWN[sp].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE], 'Miner' + Game.time, { memory: { Type: 'economical', role: 'miner', sourceID: sou[i].ID, work_with_link: false } });
                                                                } else {
                                                                    sou[i].spots = 2;
                                                                    SPAWN[sp].spawnCreep([WORK, WORK, MOVE], 'Miner' + Game.time, { memory: { Type: 'economical', role: 'miner', sourceID: sou[i].ID, work_with_link: false } });
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            if ((Game.rooms[SPAWN[0].room.name].energyAvailable + Number(Game.rooms[SPAWN[0].room.name].storage.store.getUsedCapacity(RESOURCE_ENERGY))) > 300 && Game.rooms[SPAWN[0].room.name].storage.my && SPAWN[0].memory.Info.workers.economical.miner > 0 && SPAWN[0].memory.Info.workers.economical.truck > 0) {
                                                                sou[i].spots = 1;
                                                                SPAWN[sp].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE], 'Miner' + Game.time, { memory: { Type: 'economical', role: 'miner', sourceID: sou[i].ID, work_with_link: false } });
                                                            }
                                                            else {
                                                                sou[i].spots = 3;
                                                                SPAWN[sp].spawnCreep([WORK, WORK, MOVE], 'Miner' + Game.time, { memory: { Type: 'economical', role: 'miner', sourceID: sou[i].ID, work_with_link: false } });
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        if ((SPAWN[0].room.energyAvailable + (SPAWN[0].room.storage != undefined ? SPAWN[0].room.storage.store.getUsedCapacity(RESOURCE_ENERGY) : 0)) > 750/*|| SPAWN[0].memory.Info.workers.economical.miner >= 1*/) {
                                                            sou[i].spots = 1;
                                                            SPAWN[sp].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE], 'Miner' + Game.time, { memory: { Type: 'economical', role: 'miner', sourceID: sou[i].ID, work_with_link: false } });
                                                        }
                                                        else {
                                                            SPAWN[sp].spawnCreep([WORK, WORK, MOVE], 'Miner' + Game.time, { memory: { Type: 'economical', role: 'miner', sourceID: sou[i].ID, work_with_link: false } });
                                                        }
                                                    }
                                                    sou[i].currMiners++;
                                                }
                                            }
                                        }
                                        SPAWN[0].memory.Info.workers.economical.miner++;
                                        break;
                                    }
                                    case 'Filler': {
                                        if (SPAWN[0].room.storage != undefined ? SPAWN[0].room.storage.store.getUsedCapacity(RESOURCE_ENERGY) >= 1000 : false) {
                                            if(SPAWN[0].room.energyAvailable <= 300){
                                                SPAWN[sp].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'Filler' + Game.time, { memory: { Type: 'economical', role: 'filler', isHarvesting: true } });
                                            }else{
                                                SPAWN[sp].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'Filler' + Game.time, { memory: { Type: 'economical', role: 'filler', isHarvesting: true } });
                                            }
                                        }
                                        SPAWN[0].memory.Info.workers.economical.Filler++;
                                        break;
                                    }

                                }
                            }
                        }


                        //console.log(JSON.stringify(Game.spawns['spawn1-1'].spawning));
                        //if (SPAWN[sp].spawning) { console.log('SPAWNING IN ROOM -',SPAWN[sp].room.name, '     CREEP: -', SPAWN[sp].spawning.name)};
                    }
                    else{
                        
                        
                        
                    }
                }
            }
        }
    }
};