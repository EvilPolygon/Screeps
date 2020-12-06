module.exports = {

    run: function () {
        for (let i in Game.rooms) {

            let hostile = Game.rooms[i].find(FIND_HOSTILE_CREEPS);
            let SPAWN = Game.rooms[i].find(FIND_MY_SPAWNS);
            let towers = Game.rooms[i].find(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_TOWER
            });

            if (hostile.length > 0 && SPAWN.length > 0 && towers.length == 0) {

                let Cparts = Math.trunc(Game.rooms[i].memory.AvailableEnergy / 130);
                if (Cparts > 0) {
                    let parts = [];
                    for (let Np = 0; Np < Cparts; Np++) {
                        parts.push('attack');
                        parts.push('move');
                    }
                    Game.spawns[SPAWN[0].name].spawnCreep(parts, 'DEFENDER' + Game.time, { memory: { Type: 'economical',  role: 'defender', ex: 0, home: SPAWN[0].name } });
                }
            }
            
            /*for (let cr in Game.creeps) {
                if (Game.creeps[cr].memory.role == 'defender') {
                    
                }
            }*/

            if (towers.length > 0 && SPAWN.length >= 1) {


                let enemy = towers[0].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (enemy) {
                    towers.forEach(tower => tower.attack(enemy));
                } else {
                    let DStruc = towers[0].pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => (structure.hits < structure.hitsMax) && structure.structureType != STRUCTURE_WALL
                    });

                    if (DStruc) {
                        for (let tw in towers) {
                            if (towers[tw].store.getUsedCapacity(RESOURCE_ENERGY) > 600) {
                                towers[tw].repair(DStruc);
                            }
                        }
                    }
                }
                
                if(Game.spawns[SPAWN[0].name].memory.workers.loaders == 0){
                    Game.spawns[SPAWN[0].name].memory.workers.loaders = 1;
                }

            }
        }
    }
};