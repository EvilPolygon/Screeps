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
        
        let targets = ['5f6120f251fdd9e56d754539','5f6120ed1a0464f1d0445d52','5f6fb253c4a4c34758034f43',
                       '5f6fb83a48c32ebb71c29abf','5f6fad8a90dc1f1fd1826c4b','5f6fad7f8cf98f2f92fbb90d',
                       '5f6c932a1e0a38b2e5e907c8','5f6c9334b2c89a7dd254e7a8','5f6c92c72f2af22b60281c1c',
                       '5f6c92c1c66ee84c44017802','5f616afbb88a487362920e63','5f73a12d269deef07fc5c9da',
                       '5f5ed9defb28e43a9fbd3db3','5f7a25ae97107953b6530bc0','5f7a3d5b90ee6b3bc9a5f850',
                       '5f7a3d5ac4eec41371be6999','5f7a3d5990ee6b1208a5f84e','5f7a3eae90ee6b80cea5f883',
                       '5f74f8b764979d13b52e67f1'];
                       
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
                creep.moveTo(creep.pos.findClosestByPath(creep.room.find(FIND_EXIT_TOP)));
            }
            else
            {
                if(creep.claimController(creep.room.controller) == -9){
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }

};