module.exports = {
    
    run: function(){
        console.log('WTF DUDE');
        for(let i in Game.rooms){
            
            let SPAWN = Game.rooms[i].find(FIND_MY_SPAWNS);
        }

        for(let i in Game.rooms){
            if(!Game.rooms[i].memory.exits){
                Game.rooms[i].memory.exits = {
                    Exittop:    {Epos: Game.rooms[i].find(FIND_EXIT_TOP).length >0 ? true:false, isHostile:false},
                    Exitright:  {Epos: Game.rooms[i].find(FIND_EXIT_RIGHT).length >0 ? true:false, isHostile:false},
                    Exitbottom: {Epos: Game.rooms[i].find(FIND_EXIT_BOTTOM).length >0 ? true:false, isHostile:false},
                    Exitleft:   {Epos: Game.rooms[i].find(FIND_EXIT_LEFT).length >0 ? true:false, isHostile:false},
                }
                Game.rooms[i].memory.AvailableEnergy =0;
            }
            Game.rooms[i].memory.AvailableEnergy = Game.rooms[i].energyAvailable;
        }
        //----------------------------------------------

        for ( let i in Memory.creeps){
            if (!Game.creeps[i]){
                delete Memory.creeps[i];
            }
        }
    }

};