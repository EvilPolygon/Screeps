module.exports = {
    
    run: function(){
        
        let towers = Game.spawns['spawn1'].room.find(FIND_STRUCTURES,{
            filter: (structure) => structure.structureType == STRUCTURE_TOWER});
        
        if(towers.length >0){
            
            /*let DStruc = towers[0].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            
            if(DStruc){
                towers.forEach(tower => tower.repair(DStruc));
            }*/
            
            let enemy = towers[0].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (enemy){
                towers.forEach(tower => tower.attack(enemy));
            }
            
        }
        
    }
};