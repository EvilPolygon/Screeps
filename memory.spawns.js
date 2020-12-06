module.exports = {

    run: function () {

        for (let i in Game.rooms) {

            let SPAWN = Game.rooms[i].find(FIND_MY_SPAWNS);

            if (SPAWN[0]) {
                
                //---------------- СОЗДАНИЕ ПАМЯТИ ДЛЯ НОВОГО СПАВНА
                if (Object.keys(SPAWN[0].memory).length == 0) {
                    SPAWN[0].memory = {
                        workers: {
                            LoneDiggers: 0,
                            builders: 0,
                            upgraders: 2,
                            harvesters: 0,
                            economical: {
                                truck: 2,
                                miner: 10,
                                Filler: 0,
                                operator:0,
                                for_extractors:{
                                    extractors:0,
                                    taker:0,
                                    ticks_for_work:0,
                                }
                            },
                            loaders: 0,
                        },
                        Info: {
                            workers: { economical: {} },
                            offense: {},
                            nextLonediggerRoom: 0,
                            for_lonediggers: {},
                        }
                    }
                }
                //----------------------------------------------------------
                if (SPAWN[0].memory.Info.sources == undefined) {
                    SPAWN[0].memory.Info.sources = {};
                    let sou = SPAWN[0].room.find(FIND_SOURCES);
                    let iter = 0;
                    for (let i in sou) {
                        SPAWN[0].memory.Info.sources['source' + iter] = { ID: sou[i].id, spots: 2, currMiners: 0 };
                        iter++;
                    }
                }
                //----------------------------------------------------------
                
                for (let i in SPAWN[0].memory.for_lonediggers){
                    if(Object.keys(SPAWN[0].memory.for_lonediggers[i]).length == 0){
                        SPAWN[0].memory.for_lonediggers[i] = {
                            need: 0,
                            sources: [],
                            pathTo: Game.map.findRoute(SPAWN[0].room.name, i),
                            pathHome: Game.map.findRoute(i, SPAWN[0].room.name),
                        }
                    }
                    
                    let m = SPAWN[0].memory.for_lonediggers;
                    if(m[i].sources.length > 0){
                        for ( let j in m[i].sources){//console.log(_.find(Game.creeps, c => c.memory.role == 'LoneDigger' && c.memory.source_id == m[i].sources[j].id));
                            m[i].sources[j].sent = _.find(Game.creeps, c => c.memory.role == 'LoneDigger' && c.memory.source_id == m[i].sources[j].id) ? true: false;
                        }
                    }
                    
                }
                
                let src = SPAWN[0].memory.Info.sources;
                for (let i in src) {
                    src[i].currMiners = (SPAWN[0].room.find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.sourceID == src[i].ID })).length;
                    
                    for(let sp in SPAWN){
                        if(SPAWN[sp].spawning){
                            if(Game.creeps[SPAWN[sp].spawning.name].memory.role == 'miner'){
                                src[i].currMiners += Game.creeps[SPAWN[sp].spawning.name].memory.sourceID == src[i].ID ? 1:0;
                            }
                        }
                    }
                }
                
            }
        }
    }
};