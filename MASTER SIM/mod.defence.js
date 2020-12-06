module.exports = {
    
    run: function(){
        for( let i in Game.rooms){
        let towers = Game.rooms[i].find(FIND_STRUCTURES,{
            filter: (structure) => structure.structureType == STRUCTURE_TOWER});
        
        if(towers.length >0){
            
            /*let DStruc = towers[0].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            
            if(DStruc){
                towers.forEach(tower => tower.repair(DStruc));
            }*/
            
            let SPAWN = Game.rooms[i].find(FIND_MY_SPAWNS);
            Game.spawns[SPAWN[0].name].memory.workers.loaders = 1;
            
            let enemy = towers[0].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (enemy){
                towers.forEach(tower => tower.attack(enemy));
            }
            
        }
        }
    }
};