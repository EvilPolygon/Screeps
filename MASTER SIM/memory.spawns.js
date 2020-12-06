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
                            builders: 1,
                            upgraders: 1,
                            harvesters: 0,
                            economical: {
                                truck: 1,
                                miner: 10,
                                Filler: 0,
                            },
                            loaders: 0,
                        },
                        Info: {
                            workers: { economical: {} },
                            offense: {},
                        },
                        offense: {
                            turtles: 0,
                            interdictors: 0,
                            dismantlers: 0,
                            claimers: 0,
                        }
                    }
                }
                //----------------------------------------------------------
                if (SPAWN[0].memory.Info.sources == undefined) {
                    SPAWN[0].memory.Info.sources = {};
                    let sou = SPAWN[0].room.find(FIND_SOURCES);
                    let iter = 0;
                    for (let i in sou) {
                        SPAWN[0].memory.Info.sources['source' + iter] = { ID: sou[i].id, spots: 3, currMiners: 0 };
                        iter++;
                    }
                }
                //----------------------------------------------------------

                let src = SPAWN[0].memory.Info.sources;
                for (let i in src) {
                    src[i].currMiners = (SPAWN[0].room.find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.sourceID == src[i].ID })).length;
                }


            }
        }
    }
};