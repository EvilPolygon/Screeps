module.exports = {

    run: function(){
        
        //записываем в info текущее количество рабочих
        
        Game.spawns['spawn1'].memory.Info.workers.harvesters = (_.filter(Game.creeps, (creep) => creep.memory.role == 'harvester')).length;
        Game.spawns['spawn1'].memory.Info.workers.upgraders = (_.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader')).length;
        Game.spawns['spawn1'].memory.Info.workers.builders = (_.filter(Game.creeps, (creep) => creep.memory.role == 'builder')).length;
        
        let Gmem = Game.spawns['spawn1'].memory;
        
        for (let Role in Gmem.workers){
            
            //console.log(Role);
            
            if(Gmem.Info.workers[Role] < Gmem.workers[Role]){
                switch (Role){
                    
                    case 'builders':
                        Game.spawns['spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE],'Builder' + Game.time,{memory: {role: 'builder', isHarvesting: true}});
                        console.log("Spawn Builder" + Game.time); break;
                    
                    case 'upgraders':
                        Game.spawns['spawn1'].spawnCreep([WORK,CARRY,MOVE],'Upg' + Game.time,{memory:{role:'upgrader', isHarvesting: true}});
                        console.log('Spawn Upg' + Game.time); break;
                    
                    case 'harvesters':
                        Game.spawns['spawn1'].spawnCreep([WORK,CARRY,MOVE],'Harv' + Game.time,{memory:{role: 'harvester'}});
                        console.log('Spawn Harv' + Game.time); break;
                }
                
            }
        }
        
    }
};