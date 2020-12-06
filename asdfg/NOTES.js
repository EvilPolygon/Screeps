/*
---------===== ПЛАНЫ =====------------
1) расширение в другие комнаты (глянь еще раз методы для перемещения и нахождения пути)
2) более эффективный сбор ресурсов
3) *башни срочно*

-------       Фичи          ---------
(_.forEach(Game.rooms['W24N1'].findPath(new RoomPosition(28,25,'W24N1'),new RoomPosition(25,1,'W24N1'), {ignoreCreeps: true}), Pos => {Game.rooms['W24N1'].createConstructionSite(Pos.x, Pos.y, STRUCTURE_ROAD);}))
_.forEach(_.filter(Game.creeps, cr => cr.memory.role == 'LoneDigger'), c => c.memory.Alert = 0)

+++++*****   ИДЕИ    *****+++++
- в атакующих формированиях попробовать тему с крипом командиром

module.exports = {
    
    run:function(creep){
        
        if(creep.memory.role == 'turtle'){
            //console.log(creep.room.name, creep.memory.home);
            if(creep.room.name == creep.memory.home){//console.log(creep.room.find(creep.memory.hostileRoom));
                creep.moveTo(creep.pos.findClosestByPath(creep.room.find(creep.memory.hostileRoom)));
            }
            else{
                creep.moveTo(3,48);
            }
        }
        
        let targets = ['5f6c9334b2c89a7dd254e7a8','5f6c932a1e0a38b2e5e907c8','5f6c92c72f2af22b60281c1c','5f616afbb88a487362920e63','5f73a12d269deef07fc5c9da','5f5ed9defb28e43a9fbd3db3'];
                       
        if (creep.memory.role == 'dismantler'){
            if(creep.room.name == creep.memory.home){//console.log(creep.room.find(creep.memory.hostileRoom));
                creep.moveTo(creep.pos.findClosestByPath(creep.room.find(creep.memory.hostileRoom)));
            }
            else{
                if(!creep.room.controller.safeMode){
                    let pt = [];
                    targets.forEach(i => {
                        let foo = Game.getObjectById(i);
                        if(foo){
                            pt.push(Game.getObjectById(i));
                        }
                    });
                    
                    let tar = creep.pos.findClosestByPath(pt);
                    
                    if(creep.dismantle(tar) == -9){
                    creep.moveTo(tar);
                    }
                    
                    if((creep.room.find(FIND_HOSTILE_SPAWNS)).length == 0){
                        Game.spawns['spawn1'].memory.offense.dismantlers = 0;
                    }
                }
                else {
                    creep.moveTo(3,48);
                }
            }
        }
        
        if (creep.memory.role == 'interdictor'){
            if(creep.room.name == creep.memory.home){//console.log(creep.room.find(creep.memory.hostileRoom));
                creep.moveTo(creep.pos.findClosestByPath(creep.room.find(creep.memory.hostileRoom)));
            }
            else{
                let pt = creep.pos.findClosestByPath(Game.getObjectById(targets));
                if(creep.attack(pt) == -9){
                creep.moveTo(pt);
                }
            }
        }
        
        if(creep.memory.role == 'claimer'){
            if(creep.room.controller.my){
                creep.moveTo(creep.pos.findClosestByPath(creep.room.find(FIND_EXIT_RIGHT)));
            }
            else
            {
                if(creep.attackController(creep.room.controller) == -9){
                    creep.moveTo(creep.room.controller);console.log('in');
                }
                if(creep.claimController(creep.room.controller) == -9){
                    creep.moveTo(creep.room.controller);
                }
                if(Game.rooms['W22N1'].controller.my == true){
                    Game.spawns['spawn1'].memory.offense.claimers = 0;
                }
            }
        }
        
        if( creep.memory.role == 'interceptor'){
            
        }
    }

};
*/