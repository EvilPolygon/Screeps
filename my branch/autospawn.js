module.exports = {

    run: function(){
        
        //записываем в info текущее количество рабочих
        
        Game.spawns['spawn1'].memory.Info.workers.LoneDiggers = (_.filter(Game.creeps, (creep) => creep.memory.role == 'LoneDigger')).length;
        Game.spawns['spawn1'].memory.Info.workers.upgraders = (_.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader')).length;
        Game.spawns['spawn1'].memory.Info.workers.builders = (_.filter(Game.creeps, (creep) => creep.memory.role == 'builder')).length;
        Game.spawns['spawn1'].memory.Info.workers.economical.miner = (_.filter(Game.creeps, (creep) => creep.memory.role == 'miner')).length;
        Game.spawns['spawn1'].memory.Info.workers.economical.truck = (_.filter(Game.creeps, (creep) => creep.memory.role == 'truck')).length;
        Game.spawns['spawn1'].memory.Info.workers.loaders = (_.filter(Game.creeps, (creep) => creep.memory.role == 'loader')).length;
        Game.spawns['spawn1'].memory.Info.workers.economical.Filler = (_.filter(Game.creeps, (creep) => creep.memory.role == 'filler')).length;
        
        Game.spawns['spawn1'].memory.Info.offense.interdictors = (_.filter(Game.creeps, (creep) => creep.memory.role == 'interdictor')).length;
        Game.spawns['spawn1'].memory.Info.offense.turtles = (_.filter(Game.creeps, (creep) => creep.memory.role == 'turtle')).length;
        Game.spawns['spawn1'].memory.Info.offense.dismantlers = (_.filter(Game.creeps, (creep) => creep.memory.role == 'dismantler')).length;
        Game.spawns['spawn1'].memory.Info.offense.claimers = (_.filter(Game.creeps, (creep) => creep.memory.role == 'claimer')).length;
        Game.spawns['spawn1'].memory.Info.offense.ticks--;
        
        if(Game.spawns['spawn1'].memory.Info.offense.claimers >0) {Game.spawns['spawn1'].memory.offense.claimers = 0;}
        //console.log(Game.rooms['W22N1'].controller.safeMode);
        
        let Gmem = Game.spawns['spawn1'].memory;
        
        
        let offmem = Game.spawns['spawn1'].memory.offense;
        
        for(let i in offmem){
            
            if(Gmem.Info.offense[i] < offmem[i]){
                switch (i){
                    case 'turtles':{
                        let parts =[];
                        for(let tou = 0; tou < 45; tou++){
                            parts.push('tough');
                        }
                        for(let mov = 0; mov < 5; mov++){
                            parts.push('move');
                        }
                        Game.spawns['spawn1'].spawnCreep(parts,'Turtle' + Game.time,{memory:{Type: 'offense',role:'turtle',home:'W23N1',hostileRoom: 3}}); break;
                    }
                    case 'dismantlers':{
                        let parts =[];
                        for(let wor = 0; wor < 6; wor++){
                            parts.push('work');
                        }
                        for(let mov = 0; mov < 6; mov++){
                            parts.push('move');
                        }
                        if(Game.spawns['spawn1'].memory.Info.offense.ticks <= 0){
                            Game.spawns['spawn1'].spawnCreep(parts,'Dismantler' + Game.time,{memory:{Type: 'offense',role:'dismantler',home:'W23N1',hostileRoom: 3}});
                        }
                        break;
                    }
                    case 'claimers':{
                        Game.spawns['spawn1'].spawnCreep([CLAIM,MOVE],'Claimer' + Game.time,{memory:{Type: 'offense', role: 'claimer'}}); break;
                    }
                }
            }
        }        
        
        for (let Role in Gmem.workers){
            
            //console.log(Role);
            
            if(Gmem.Info.workers[Role] < Gmem.workers[Role]){ 
                switch (Role){ 
                    
                    case 'builders':{
                        
                        if(Game.spawns['spawn1'].room.controller.level <= 3){
                            Game.spawns['spawn1'].spawnCreep([WORK, CARRY, MOVE],'Builder' + Game.time,{memory: {role: 'builder', isHarvesting: true}});
                        }else{
                        Game.spawns['spawn1'].spawnCreep([WORK, WORK, WORK, CARRY,CARRY,CARRY,CARRY, MOVE, MOVE],'Builder' + Game.time,{memory: {role: 'builder', isHarvesting: true, repWalls: Game.time % 2}});
                        }
                         break;
                    }
                    case 'upgraders':
                        Game.spawns['spawn1'].spawnCreep([WORK,CARRY, CARRY,MOVE, MOVE],'Upg' + Game.time,{memory:{role:'upgrader', isHarvesting: true}});
                         break;
                    
                    case 'loaders':
                        Game.spawns['spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],'Loader' + Game.time,{memory:{Type: 'economical', role: 'loader', pickingUp : true}});
                         break;
                    
                    case 'LoneDiggers':{ //-------------  КОД ДЛЯ ДАЛЬНИХ ДОБЫТЧИКОВ -------------------------
                        let modR = 0;
                        let K = 1;
                        let targetR = [];
                        for(let i in Game.rooms['W23N1'].memory.exits){
                            if (Game.rooms['W23N1'].memory.exits[i].Epos && Game.rooms['W23N1'].memory.exits[i].isHostile != true){ 
                                modR++;
                                targetR.push(K);
                            }
                            K = K + 2;
                        }
                        let Ftarget = Game.spawns['spawn1'].memory.Info.workers.LoneDiggers % modR;
                        
                        Game.spawns['spawn1'].spawnCreep([WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],'LoneDigger' + Game.time,{memory:{role: 'LoneDigger', isHarvesting: true, home:'W23N1', targetRoom:targetR[Ftarget]}}); 
                        break;
                    }
                }
                
            }
        }
        
        let Ecomem = Game.spawns['spawn1'].memory.workers.economical;
        
        for (let Eco in Ecomem){
            //console.log(Gmem.Info.workers.economical[Eco] < Ecomem[Eco]);
            if (Gmem.Info.workers.economical[Eco] < Ecomem[Eco]){//console.log(Eco);
                switch (Eco){
                    case 'Filler':{
                        Game.spawns['spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],'Filler' + Game.time, {memory: {Type: 'economical', role: 'filler', isHarvesting: true}}); break;
                    }
                    case 'truck':
                        Game.spawns['spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],'Truck' + Game.time, {memory: {Type: 'economical', role: 'truck', pickingUp: true}}); break;
                        
                    case 'miner':{
                        //console.log('in');
                        let sou = Game.spawns['spawn1'].memory.Info.sources;
                        
                        if(sou.source0.currMiners < sou.source0.spots){ //console.log('in s0');
                            Game.spawns['spawn1'].spawnCreep([WORK,WORK,MOVE], 'Miner' + Game.time, {memory: {Type: 'economical',role: 'miner', sourceID:sou.source0.ID}});
                        }
                        
                        if(sou.source1.currMiners < sou.source1.spots){ //console.log(sou.source1.spots);
                            Game.spawns['spawn1'].spawnCreep([WORK,WORK,MOVE], 'Miner' + Game.time, {memory: {Type: 'economical',role: 'miner', sourceID:sou.source1.ID}});
                        }
                        //Game.spawns['spawn1'].spawnCreep([WORK,WORK,MOVE], 'Miner' + Game.time, {memory: {Type: 'economical',role: 'miner', sourceID:''}}); break;
                    }
                    
                }
            }
        }
        

        
        if(Game.spawns['spawn1'].spawning){console.log('SPAWNING ',Game.spawns['spawn1'].spawning.name);}
        
       
    }
};