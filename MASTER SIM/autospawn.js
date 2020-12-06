module.exports = {

    run: function () {

        for (let i in Game.rooms) {

            let SPAWN = Game.rooms[i].find(FIND_MY_SPAWNS);

            if (SPAWN[0]) {
//console.log( 'ROOM IS' ,SPAWN[0].room.name);
                //записываем в info текущее количество рабочих

                SPAWN[0].memory.Info.workers.LoneDiggers = (_.filter(Game.creeps,  (creep) => (creep.memory.role == 'LoneDigger') && (creep.memory.home == SPAWN[0].room.name))).length;
                SPAWN[0].memory.Info.workers.upgraders = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, {filter:  (creep) => creep.memory.role == 'upgrader'}))).length;
                SPAWN[0].memory.Info.workers.builders = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, {filter:  (creep) => creep.memory.role == 'builder'}))).length;
                SPAWN[0].memory.Info.workers.economical.truck = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, {filter:  (creep) => creep.memory.role == 'truck'}))).length;
                SPAWN[0].memory.Info.workers.economical.miner = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, {filter:  (creep) => creep.memory.role == 'miner'}))).length;
                SPAWN[0].memory.Info.workers.loaders = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, {filter:  (creep) => creep.memory.role == 'loader'}))).length;
                SPAWN[0].memory.Info.workers.economical.Filler = (_.filter(Game.rooms[i].find(FIND_MY_CREEPS, {filter:  (creep) => creep.memory.role == 'filler'}))).length;

                SPAWN[0].memory.Info.offense.interdictors = (_.filter(Game.creeps, (creep) => creep.memory.role == 'interdictor')).length;
                SPAWN[0].memory.Info.offense.turtles = (_.filter(Game.creeps, (creep) => creep.memory.role == 'turtle')).length;
                SPAWN[0].memory.Info.offense.dismantlers = (_.filter(Game.creeps, (creep) => creep.memory.role == 'dismantler')).length;
                SPAWN[0].memory.Info.offense.claimers = (_.filter(Game.creeps, (creep) => creep.memory.role == 'claimer')).length;
                SPAWN[0].memory.Info.offense.ticks--;

                //if (SPAWN[0].memory.Info.offense.claimers > 0) { SPAWN[0].memory.offense.claimers = 0; }
                //console.log(Game.rooms['W22N1'].controller.safeMode);

                for (let sp in SPAWN) {

                    let Gmem = SPAWN[0].memory;


                    let offmem = SPAWN[0].memory.offense;

                    for (let i in offmem) {

                        if (Gmem.Info.offense[i] < offmem[i]) {
                            switch (i) {
                                case 'turtles': {
                                    let parts = [];
                                    for (let tou = 0; tou < 45; tou++) {
                                        parts.push('tough');
                                    }
                                    for (let mov = 0; mov < 5; mov++) {
                                        parts.push('move');
                                    }
                                    SPAWN[sp].spawnCreep(parts, 'Turtle' + Game.time, { memory: { Type: 'offense', role: 'turtle', home: 'W23N1', hostileRoom: 3 } }); break;
                                }
                                case 'dismantlers': {
                                    let parts = [];
                                    for (let wor = 0; wor < 6; wor++) {
                                        parts.push('work');
                                    }
                                    for (let mov = 0; mov < 6; mov++) {
                                        parts.push('move');
                                    }
                                    if (SPAWN[0].memory.Info.offense.ticks <= 0) {
                                        SPAWN[sp].spawnCreep(parts, 'Dismantler' + Game.time, { memory: { Type: 'offense', role: 'dismantler', home: 'W23N1', hostileRoom: 3 } });
                                    }
                                    break;
                                }
                                case 'claimers': {
                                    SPAWN[sp].spawnCreep([CLAIM, MOVE], 'Claimer' + Game.time, { memory: { Type: 'offense', role: 'claimer' } }); break;
                                }
                            }
                        }
                    }

                    for (let Role in Gmem.workers) {

                        //console.log(Role);

                        if (Gmem.Info.workers[Role] < Gmem.workers[Role]) {
                            switch (Role) {

                                case 'builders': {

                                    if (SPAWN[0].room.controller.level <= 3) {
                                        SPAWN[sp].spawnCreep([WORK, CARRY, MOVE, CARRY, MOVE], 'Builder' + Game.time, { memory: { role: 'builder', isHarvesting: true } });
                                    } else {
                                        SPAWN[sp].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'Builder' + Game.time, { memory: { role: 'builder', isHarvesting: true, repWalls: 0 } });
                                    }
                                    break;
                                }
                                case 'upgraders':
                                    SPAWN[sp].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], 'Upg' + Game.time, { memory: { role: 'upgrader', isHarvesting: true } });
                                    break;

                                case 'loaders':
                                    SPAWN[sp].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'Loader' + Game.time, { memory: { Type: 'economical', role: 'loader', pickingUp: true } });
                                    break;

                                case 'LoneDiggers': { //-------------  КОД ДЛЯ ДАЛЬНИХ ДОБЫТЧИКОВ -------------------------
                                    let modR = 0;
                                    let K = 1;
                                    let targetR = [];
                                    for (let i in Game.rooms[SPAWN[sp].room.name].memory.exits) {
                                        if (Game.rooms[SPAWN[sp].room.name].memory.exits[i].Epos && Game.rooms['W23N1'].memory.exits[i].isHostile != true) {
                                            modR++;
                                            targetR.push(K);
                                        }
                                        K = K + 2;
                                    }
                                    let Ftarget = SPAWN[0].memory.Info.workers.LoneDiggers % modR;

                                    SPAWN[sp].spawnCreep([WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'LoneDigger' + Game.time, { memory: { role: 'LoneDigger', isHarvesting: true, home: SPAWN[sp].room.name, targetRoom: targetR[Ftarget] } });
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
                                case 'Filler': {
                                    SPAWN[sp].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'Filler' + Game.time, { memory: { Type: 'economical', role: 'filler', isHarvesting: true } }); break;
                                }
                                case 'truck':{
                                    SPAWN[sp].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'Truck' + Game.time, { memory: { Type: 'economical', role: 'truck', pickingUp: true } }); break;}

                                case 'miner': {//console.log(Gmem.Info.workers.economical.miner == 0 || Ecomem.truck <= Gmem.Info.workers.economical.truck, SPAWN[0].name);
                                    if (Gmem.Info.workers.economical.miner == 0 || Ecomem.truck <= Gmem.Info.workers.economical.truck) {
                                        //console.log('in');
                                        let sou = SPAWN[0].memory.Info.sources;

                                        for (let i in sou) {
                                            //console.log(sou[i].currMiners, sou[i].currMiners < sou[i].spots, sou[i].spots, sou[i].ID);
                                            if (sou[i].currMiners < sou[i].spots) {
                                                SPAWN[sp].spawnCreep([WORK, WORK, MOVE], 'Miner' + Game.time, { memory: { Type: 'economical', role: 'miner', sourceID: sou[i].ID } });
                                            }
                                        }
                                    }
                                    break;
                                }

                            }
                        }
                    }



                    if (SPAWN[sp].spawning) { console.log('SPAWNING IN ROOM -',SPAWN[sp].room.name, '     CREEP: -', SPAWN[sp].spawning.name)};

                }
            }
        }
    }
};