/*
---------===== ПЛАНЫ =====------------
1) расширение в другие комнаты (глянь еще раз методы для перемещения и нахождения пути)
2) более эффективный сбор ресурсов
3) *башни срочно*

-------       Фичи          ---------
(_.forEach(Game.rooms['W23N1'].findPath(new RoomPosition(34,28,'W23N1'),new RoomPosition(48,43,'W23N1'), {ignoreCreeps: true, swampCost: 5}), Pos => {Game.rooms['W23N1'].createConstructionSite(Pos.x, Pos.y, STRUCTURE_ROAD);}))
_.forEach(_.filter(Game.creeps, cr => cr.memory.role == 'LoneDigger'), c => c.memory.Alert = 0)

+++++*****   ИДЕИ    *****+++++
- в атакующих формированиях попробовать тему с крипом командиром

case 'LoneDiggers': { //-------------  КОД ДЛЯ ДАЛЬНИХ ДОБЫТЧИКОВ -----------------------------------------------------------------------------------------------------------------------------
                                        if (SPAWN[0].room.energyAvailable >= 550 && SPAWN[0].memory.Info.workers.economical.miner > 0) {
                                            let K = 1;
                                            let targetR = [];
                                            for (let i in Game.rooms[SPAWN[sp].room.name].memory.exits) {
                                                if (Game.rooms[SPAWN[sp].room.name].memory.exits[i].Epos && Game.rooms[SPAWN[sp].room.name].memory.exits[i].isHostile != true) {
                                                    targetR.push(K);
                                                }
                                                K = K + 2;
                                            }
                                            if (SPAWN[0].memory.Info.nextLonediggerRoom === undefined) {
                                                SPAWN[0].memory.Info.nextLonediggerRoom = 0;
                                            }
                                            
                                            if(SPAWN[sp].room.controller.level < 4){
                                                if(_.find(Game.creeps, c => c.memory.role == 'LoneDigger' && c.memory.home == SPAWN[sp].room.name && c.memory.targetRoom == targetR[SPAWN[0].memory.Info.nextLonediggerRoom] && c.getActiveBodyparts('work') > 1)){
                                                    if(_.filter(Game.creeps, c => c.memory.role == 'LoneDigger' && c.memory.home == SPAWN[sp].room.name && c.memory.targetRoom == targetR[SPAWN[0].memory.Info.nextLonediggerRoom] && c.getActiveBodyparts('work') == 1).length < 3){
                                                        SPAWN[sp].spawnCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'LoneDigger' + Game.time, { memory: { role: 'LoneDigger', isHarvesting: true, home: SPAWN[sp].room.name, targetRoom: targetR[SPAWN[0].memory.Info.nextLonediggerRoom] , Alert: 0} });
                                                    }
                                                }
                                                else{
                                                    SPAWN[sp].spawnCreep([WORK, WORK, WORK, MOVE, MOVE, MOVE], 'LoneDigger' + Game.time, { memory: { role: 'LoneDigger', isHarvesting: true, home: SPAWN[sp].room.name, targetRoom: targetR[SPAWN[0].memory.Info.nextLonediggerRoom] , Alert: 0} });
                                                }
                                            }
                                            else{
                                                if(_.find(Game.creeps, c => c.memory.role == 'LoneDigger' && c.memory.home == SPAWN[sp].room.name && c.memory.targetRoom == targetR[SPAWN[0].memory.Info.nextLonediggerRoom] && c.getActiveBodyparts('work') > 1)){
                                                    if(_.filter(Game.creeps, c => c.memory.role == 'LoneDigger' && c.memory.home == SPAWN[sp].room.name && c.memory.targetRoom == targetR[SPAWN[0].memory.Info.nextLonediggerRoom] && c.getActiveBodyparts('work') == 1).length < 3){
                                                        SPAWN[sp].spawnCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'LoneDigger' + Game.time, { memory: { role: 'LoneDigger', isHarvesting: true, home: SPAWN[sp].room.name, targetRoom: targetR[SPAWN[0].memory.Info.nextLonediggerRoom] , Alert: 0} });
                                                    }
                                                }
                                                else{
                                                    SPAWN[sp].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], 'LoneDigger' + Game.time, { memory: { role: 'LoneDigger', isHarvesting: true, home: SPAWN[sp].room.name, targetRoom: targetR[SPAWN[0].memory.Info.nextLonediggerRoom] , Alert: 0} });
                                                }
                                            }
                                            
                                            SPAWN[0].memory.Info.nextLonediggerRoom = (SPAWN[0].memory.Info.nextLonediggerRoom + 1) % targetR.length;
                                        }
                                        SPAWN[0].memory.Info.workers.LoneDiggers++;
                                        break;
                                    }
*/