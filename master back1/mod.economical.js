module.exports = {

    run: function (creep) {


        if (creep.memory.role == 'miner') {

            if (creep.harvest(Game.getObjectById(creep.memory.sourceID)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.sourceID), { reusePath: 1 });
            }
            if (creep.memory.work_with_link) {
                if(creep.transfer(Game.getObjectById(creep.memory.linkID), RESOURCE_ENERGY) == -9){
                    creep.moveTo(Game.getObjectById(creep.memory.linkID));
                };
            }
        }
        
        if(creep.memory.role == 'extractor'){
            let ext = Game.getObjectById(creep.memory.mineralID);
            if(creep.harvest(ext) == -9){
                creep.moveTo(ext, {reusePath: 20});
            }
            
        }
        
        if(creep.memory.role == 'taker'){
            
            if(creep.store.getFreeCapacity() == 0){
                creep.memory.isHarvesting = false;
            }
            else{
                creep.memory.isHarvesting = true;
            }
            
            if(creep.memory.isHarvesting){
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: structure =>{
                                return (structure.structureType == 'container') && structure.store.getUsedCapacity() > 60 && structure.store.getUsedCapacity(RESOURCE_ENERGY) == 0
                        }});
                if(target){
                    for( let i = 1; i < RESOURCES_ALL.length; i++){
                        creep.withdraw(target, RESOURCES_ALL[i]);
                        creep.moveTo(target, { reusePath: 10 });
                        
                    }
                }
                else{
                    let scrap = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: resource => resource.amount > 0 && resource.resourceType != RESOURCE_ENERGY});
                    
                    if(scrap){
                        for( let i = 0; i < RESOURCES_ALL.length; i++){
                            if (creep.pickup(scrap, RESOURCES_ALL[i]) == -9) {
                                creep.moveTo(scrap, { reusePath: 10 });
                            }
                        }
                    }
                }
            }
            else{
                let st = creep.room.find(FIND_MY_STRUCTURES, {filter:  s=> (s.structureType == 'terminal') && s.store.getFreeCapacity() > 0});
                let nst = creep.pos.findClosestByPath(st);
                
                if(nst){
                    for (let i = 1; i < RESOURCES_ALL.length; i++){
                        if(creep.transfer(nst, RESOURCES_ALL[i]) == -9){
                            creep.moveTo(nst, {reusePath: 10});
                        }
                    }
                }
                else{
                    for (let i = 1; i < RESOURCES_ALL.length; i++){
                        if(creep.transfer(creep.room.storage, RESOURCES_ALL[i]) == -9){
                            creep.moveTo(creep.room.storage, {reusePath: 10});
                        }
                    }
                }
            }
        }

        if (creep.memory.role == 'truck') {

            if (creep.store.getFreeCapacity() == 0) {
                creep.memory.pickingUp = false;
            }

            if (creep.store.getUsedCapacity() == 0) {
                creep.memory.pickingUp = true;
            }

            if (creep.memory.pickingUp == true) {

                let scrap = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: resource => resource.amount > 100 });

                if (scrap) {

                    if (creep.pickup(scrap) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(scrap);
                    }
                }
                else {
                    let containers = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => (
                            structure.structureType == 'container') &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 100
                    }));
                    //console.log(containers);

                    if (creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers);
                    }
                }

            }
            else {
                let storages = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                            (structure.room.name == creep.room.name);
                    }
                });
                //console.log(storages);
                let nearestSt = creep.pos.findClosestByPath(storages);
                if (creep.transfer(nearestSt, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestSt);
                }
                if(creep.room.storage){
                    for (let i = 1; i < RESOURCES_ALL.length; i++){
                            if(creep.transfer(creep.room.storage, RESOURCES_ALL[i]) == -9){
                                creep.moveTo(creep.room.storage, {reusePath: 10});
                            }
                        }
                }
                //console.log(storages.length);
                if (storages.length == 0) { creep.moveTo(creep.room.find(FIND_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_SPAWN })); }

            }

        }

        if (creep.memory.role == 'loader') {
            let containers = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => (structure.structureType == 'container' || structure.structureType == 'storage') && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 200 });
            //console.log('im ',containers);
            if (creep.memory.pickingUp) {
                if (creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers);
                }

                if (creep.store.getFreeCapacity() == 0) {
                    creep.memory.pickingUp = false;
                }
            }
            else {
                let tow = creep.room.find(FIND_STRUCTURES, { filter: structure => (structure.structureType == STRUCTURE_TOWER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 });
                //console.log( 'in');
                if (tow[0]) {
                    if (creep.transfer(tow[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tow[0]);
                    }
                }
                else {//console.log('double in');
                    creep.moveTo(creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_TOWER }));
                }

                if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                    creep.memory.pickingUp = true;
                }
            }
        }

        if (creep.memory.role == 'filler') {
            
            if (creep.store.getFreeCapacity() == 0) {
                creep.memory.isHarvesting = false;
            }

            if (creep.store.getUsedCapacity() == 0) {
                creep.memory.isHarvesting = true;
            }

            if (creep.memory.isHarvesting) {

                if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage.pos);
                }

            } else {

                if (creep.room.terminal) {
                    if (creep.room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 0) {
                        if (creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == -9) {
                            creep.moveTo(creep.room.terminal);
                        }
                    }
                }

                let storages = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });

                if (creep.transfer(storages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storages);
                }

                /*let Tow = creep.room.find(FIND_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) >0 })
                
                if(Tow.length >0){
                    if(creep.transfer(Tow[0], RESOURCE_ENERGY) == -9){
                        creep.moveTo(Tow[0]);                    }
                }
                */
            }
        }

        if (creep.memory.role == 'operator') {

            let link = Game.getObjectById(creep.memory.linkID.id);
            let pick = creep.store.getUsedCapacity() > 0;

            if (creep.memory.moving) {

                let rangetostorage = creep.pos.getRangeTo(creep.room.storage);
                let rangetolink = creep.pos.getRangeTo(link);
                if (creep.room.terminal != undefined) {
                    let rangetoterminal = creep.pos.getRangeTo(creep.room.terminal);

                    if (rangetostorage > 1 || rangetolink > 1 || rangetoterminal > 1) {
                        if (rangetostorage > 1) creep.moveTo(creep.room.storage);
                        if (rangetolink > 1) creep.moveTo(link);
                        if (rangetoterminal > 1) creep.moveTo(creep.room.terminal);
                    }
                    else {
                        creep.memory.moving = false;
                    }
                }
                else {
                    if (rangetostorage > 1 || rangetolink > 1) {
                        if (rangetostorage > 1) creep.moveTo(creep.room.storage);
                        if (rangetolink > 1) creep.moveTo(link);
                    }
                    else {
                        creep.memory.moving = false;
                    }
                }
            }
            else {
                let MUST_HAVE = 500;
                let T_MUST_HAVE = 10000;
                let min_stor = 50000;
                /*
                if (!pick) {
                    if (link.store.getUsedCapacity(RESOURCE_ENERGY) != MUST_HAVE) {
                        if (link.store.getUsedCapacity(RESOURCE_ENERGY) > MUST_HAVE) {
                            creep.withdraw(link, RESOURCE_ENERGY, (link.store.getUsedCapacity(RESOURCE_ENERGY) % MUST_HAVE > creep.store.getFreeCapacity(RESOURCE_ENERGY) ? creep.store.getFreeCapacity(RESOURCE_ENERGY) : link.store.getUsedCapacity(RESOURCE_ENERGY) - MUST_HAVE));
                        }
                        else {
                            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                        }
                    }
                    else {
                        if (creep.room.terminal != undefined) {
                            creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
                        }
                    }
                }
                else {
                    if (link.store.getUsedCapacity(RESOURCE_ENERGY) < MUST_HAVE) {
                        creep.transfer(link, RESOURCE_ENERGY, (MUST_HAVE - link.store.getUsedCapacity(RESOURCE_ENERGY)) > creep.store.getUsedCapacity(RESOURCE_ENERGY) ? creep.store.getUsedCapacity(RESOURCE_ENERGY) : MUST_HAVE - link.store.getUsedCapacity(RESOURCE_ENERGY));
                    }
                    else {
                        creep.transfer(creep.room.storage, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                    }
                }
                */
                
                let term = creep.room.terminal;
                
                for (let i = 0; i < RESOURCES_ALL.length; i++){
                    if(i == 0){
                        creep.transfer(creep.room.storage, 'energy');
                    }
                    else{
                        if(term != undefined){
                            creep.transfer(term, RESOURCES_ALL[i]);
                        }
                    }
                }
                        
                if (link.store.getUsedCapacity(RESOURCE_ENERGY) != MUST_HAVE){
                    if(creep.store.getUsedCapacity('energy') != creep.store.getUsedCapacity()){
                        for (let i = 1; i < RESOURCES_ALL.length; i++){
                            creep.transfer(creep.room.terminal, RESOURCES_ALL[i]);
                        }
                    }
                    else{
                        if (link.store.getUsedCapacity(RESOURCE_ENERGY) > MUST_HAVE){
                            if(pick){
                                creep.transfer(creep.room.storage, 'energy');
                            }
                            else{
                                creep.withdraw(link, RESOURCE_ENERGY, (link.store.getUsedCapacity(RESOURCE_ENERGY) % MUST_HAVE > creep.store.getFreeCapacity(RESOURCE_ENERGY) ? creep.store.getFreeCapacity(RESOURCE_ENERGY) : link.store.getUsedCapacity(RESOURCE_ENERGY) - MUST_HAVE));
                            }
                        }
                        else{
                            if(pick){
                                creep.transfer(link, RESOURCE_ENERGY, (MUST_HAVE - link.store.getUsedCapacity(RESOURCE_ENERGY)) > creep.store.getUsedCapacity(RESOURCE_ENERGY) ? creep.store.getUsedCapacity(RESOURCE_ENERGY) : MUST_HAVE - link.store.getUsedCapacity(RESOURCE_ENERGY));
                            }
                            else{
                                creep.withdraw(creep.room.storage, 'energy',(MUST_HAVE - link.store.getUsedCapacity(RESOURCE_ENERGY)) > creep.store.getFreeCapacity() ? creep.store.getFreeCapacity() : MUST_HAVE - link.store.getUsedCapacity(RESOURCE_ENERGY));
                            }
                        }
                    }
                }
                
                
            }
        }

        if (creep.memory.role == 'donor') {
                if (creep.memory.Path.length > 0) {
                    if (creep.room.name != creep.memory.Path[0].room) {
                        creep.moveTo(creep.pos.findClosestByPath(creep.memory.Path[0].exit), { reusePath: 30 });
                    }
                    else {
                        if (creep.memory.Path.length > 1) {
                            creep.moveTo(creep.pos.findClosestByPath(creep.memory.Path[1].exit));
                            creep.memory.Path.shift();
                        }
                        else {
                            creep.moveTo(creep.room.controller);
                            creep.memory.Path.shift();
                        }
                    }
                }
                else {
                    if(creep.memory.Harvest){
                        if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == -9){
                            creep.moveTo(creep.room.storage, {reusePath: 50});
                        }
                        
                        if(creep.store.getFreeCapacity() == 0){
                            creep.memory.Harvest = false;
                            creep.memory.Path = Game.map.findRoute(creep.room.name, creep.memory.to);
                        }
                        
                    }
                    else{
                        let targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: structure =>
                            (structure.structureType == 'spawn' ||
                            structure.structureType == 'extension' ||
                            structure.structureType == 'storage') &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                        });
                        if(targets != null){
                            if(creep.transfer(targets, RESOURCE_ENERGY) ==-9){
                                creep.moveTo(targets, {reusePath: 10});
                            }
                        }else{
                            if(creep.pos.getRangeTo(creep.room.controller) > 3){
                                creep.moveTo(creep.room.controller, {reusePath: 20});
                            }
                            else{
                                creep.drop(RESOURCE_ENERGY);
                            }
                        }
                        
                        if(creep.store.getFreeCapacity() == creep.store.getCapacity()){
                            creep.memory.Harvest = true;
                            creep.memory.Path = Game.map.findRoute(creep.room.name, creep.memory.from);
                        }
                        
                    }
                }
        }

    }

};