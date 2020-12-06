module.exports = {
    
    run:function (spawn){
    try{   // console.log(Object.keys(Game.spawns[spawn].memory).length);
        if(Object.keys(Game.spawns[spawn].memory).length == 0){
            Game.spawns[spawn].memory={
                workers:{
                    LoneDiggers	:	0,
	                builders	:	1,
                	upgraders	:	1,
                	harvesters	:	0,
                	economical  :{
                	    truck:1,
                	    miner:1,
                	    Filler:0,
                	},
                	loaders	:	0,
                },
                Info:{
                    workers:{economical:{}},
                    offense:{},
                },
                offense:{
                    turtles	:	0,
	                interdictors	:	0,
                    dismantlers	:	0,
                    claimers	:	0,
                }
            }
        }
    }
    catch(err){
        console.log('Я ХЗ ЧЕ ТАМ НЕ ТАК');
        console.log(err);
    }
    }
    
};