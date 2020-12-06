module.exports = {
    
    run: function(){
        //let cp = Game.cpu.getUsed();
        let labrooms = [];
        let fac_rooms = [];
        
        for (let i in Memory.rooms){
            if(Memory.rooms[i].labs){
                labrooms.push(i);
            }
            if(Memory.rooms[i].factory){
                fac_rooms.push(i);
            }
        }
        
        let mRoom = Memory.rooms;
        
        for (let i in fac_rooms){
            if(mRoom[fac_rooms[i]].factory.id == undefined){
                mRoom[fac_rooms[i]].factory.id = (Game.rooms[fac_rooms[i]].find(FIND_MY_STRUCTURES, {filter: f => f.structureType == 'factory'}))[0].id;
                mRoom[fac_rooms[i]].factory.product = {
                    comm: false,
                    min_comm: 500,
                    need: {},
                };
            }
            
            if(COMMODITIES[mRoom[fac_rooms[i]].factory.product.comm]){
                for (let j in COMMODITIES[mRoom[fac_rooms[i]].factory.product.comm].components){
                    mRoom[fac_rooms[i]].factory.product.need[j] = COMMODITIES[mRoom[fac_rooms[i]].factory.product.comm].components[j];
                }
                
                Game.getObjectById(mRoom[fac_rooms[i]].factory.id).produce(mRoom[fac_rooms[i]].factory.product.comm);
            }
            
        }
        
        for(let i in labrooms){
            //заполнение не занятых лабораторий
            let empty_labs = Game.rooms[labrooms[i]].find(FIND_STRUCTURES, {filter: l => l.structureType == 'lab' && ((l.store.getUsedCapacity('energy') == 0 && Object.keys(l.store).length == 0) || (l.store.getUsedCapacity('energy') > 0 && Object.keys(l.store).length == 1))});
            let labs_for_free = Game.rooms[labrooms[i]].find(FIND_STRUCTURES, {filter: l => l.structureType == 'lab' && (Object.keys(l.store).length > 1 || (Object.keys(l.store).length == 1 && l.store.getUsedCapacity('energy') == 0))});
            let labs = Game.rooms[labrooms[i]].find(FIND_STRUCTURES, {filter: l => l.structureType == 'lab'});
            let boostlabs = [];
            
            if(Object.keys(mRoom[labrooms[i]].labs).length > 0){
                for(let j in mRoom[labrooms[i]].labs){
                    if(mRoom[labrooms[i]].labs[j].work_labs != undefined){
                        for(let u in mRoom[labrooms[i]].labs[j].work_labs){
                            if(mRoom[labrooms[i]].labs[j].work_labs[u].id != undefined){
                                let f = _.find(empty_labs, l => l.id == mRoom[labrooms[i]].labs[j].work_labs[u].id);
                                let fr = _.find(labs_for_free, l => l.id == mRoom[labrooms[i]].labs[j].work_labs[u].id);
                                if(f != undefined){
                                    empty_labs.splice(empty_labs.findIndex(F => F.id == f.id), 1);
                                }
                                if(fr != undefined){
                                    labs_for_free.splice(labs_for_free.findIndex(F => F.id == fr.id), 1);
                                }
                            }
                        }
                    }
                }
            }
            //передача информации о лабараториях которые нужно освободить
            let forecreep = _.find(Game.creeps, c => c.room.name == labrooms[i] && c.memory.role == 'foreman');
            if(forecreep){
                forecreep.memory.labs_for_free = labs_for_free;
            }
            
            //конец заполнения незанятых лабораторий
            
            if(Object.keys(mRoom[labrooms[i]].labs).length > 0){
                for (let j in mRoom[labrooms[i]].labs){                                // инициализация нового рецепта в памяти лабораторий комнаты
                    if(Object.keys(mRoom[labrooms[i]].labs[j]).length == 0){
                        mRoom[labrooms[i]].labs[j].run_reaction = false;
                        mRoom[labrooms[i]].labs[j].rev_reaction = false;
                        mRoom[labrooms[i]].labs[j].boosting = false;
                    }                                                                   //-----------------------------
                    
                    
                    if(mRoom[labrooms[i]].labs[j].run_reaction){                        // если нужно провести реакцию
                        delete mRoom[labrooms[i]].labs[j].rev_reaction;
                        delete mRoom[labrooms[i]].labs[j].boosting;
                        
                        if(mRoom[labrooms[i]].labs[j].work_labs == undefined){
                            mRoom[labrooms[i]].labs[j].allow_multicast = false;
                            mRoom[labrooms[i]].labs[j].work_labs ={
                                _1:{},
                                _2:{},
                                res_lab:{boosting: false, max_amount: 2000}
                            }
                        }
                        else{
                            let labk = Object.keys(mRoom[labrooms[i]].labs[j].work_labs);
                            if(mRoom[labrooms[i]].labs[j].work_labs.res_lab.id == undefined || mRoom[labrooms[i]].labs[j].work_labs[labk[0]].id == undefined || mRoom[labrooms[i]].labs[j].work_labs[labk[1]].id == undefined){
                                for(let u in mRoom[labrooms[i]].labs[j].work_labs){
                                    if(u == 'res_lab'){
                                        mRoom[labrooms[i]].labs[j].work_labs[u].id = empty_labs[0].id;
                                        mRoom[labrooms[i]].labs[j].work_labs[u].res = j;
                                        empty_labs.shift();
                                    }
                                    else{
                                        if(_.find(RESOURCES_ALL, r => r == u)){
                                            let hlab = _.find(labs, l => l.store.getUsedCapacity(u) > 0);
                                            if(hlab){
                                                mRoom[labrooms[i]].labs[j].work_labs[u].id = hlab.id;
                                                mRoom[labrooms[i]].labs[j].work_labs[u].aCritical = false;
                                                mRoom[labrooms[i]].labs[j].work_labs[u].eCritical = false;
                                                mRoom[labrooms[i]].labs[j].work_labs[u].res = u;
                                            }
                                            else{
                                                mRoom[labrooms[i]].labs[j].work_labs[u].id = empty_labs[0].id;
                                                mRoom[labrooms[i]].labs[j].work_labs[u].aCritical = false;
                                                mRoom[labrooms[i]].labs[j].work_labs[u].eCritical = false;
                                                mRoom[labrooms[i]].labs[j].work_labs[u].res = u;
                                                empty_labs.shift();
                                            }
                                        }
                                    }
                                }
                            }
                            else{
                                let labkeys = Object.keys(mRoom[labrooms[i]].labs[j].work_labs);
                                
                                let mlab1 = mRoom[labrooms[i]].labs[j].work_labs[labkeys[0]];
                                let mlab2 = mRoom[labrooms[i]].labs[j].work_labs[labkeys[1]];
                                let mres_lab = mRoom[labrooms[i]].labs[j].work_labs[labkeys[2]];
                                //console.log(JSON.stringify(mlab1));
                                
                                let lab1 = Game.getObjectById(mlab1.id);
                                let lab2 = Game.getObjectById(mlab2.id);
                                let res_lab = Game.getObjectById(mres_lab.id);
                                
                                if(lab1.store.getUsedCapacity(mlab1.res) < 500){mlab1.aCritical = true}
                                if(lab2.store.getUsedCapacity(mlab2.res) < 500){mlab2.aCritical = true}
                                
                                if(lab1.store.getUsedCapacity(mlab1.res) > 2000){mlab1.aCritical = false}
                                if(lab2.store.getUsedCapacity(mlab2.res) > 2000){mlab2.aCritical = false}
                                
                                //if(lab1.store.getUsedCapacity('energy') < 500){mlab1.eCritical = true}
                                //if(lab2.store.getUsedCapacity('energy') < 500){mlab2.eCritical = true}
                                
                                //if(lab1.store.getUsedCapacity('energy') > 1500){mlab1.eCritical = false}
                                //if(lab2.store.getUsedCapacity('energy') > 1500){mlab2.eCritical = false}
                                
                                if(mRoom[labrooms[i]].labs[j].allow_multicast){
                                    for (let l in empty_labs){
                                        let st = 'resl' + l;
                                        mRoom[labrooms[i]].labs[j].work_labs[st] = {
                                            boosting: false, 
                                            max_amount: 2000,
                                            id: empty_labs[l].id,
                                            res: j
                                        }
                                    }
                                    
                                    let keysRl = Object.keys(mRoom[labrooms[i]].labs[j].work_labs);
                                    for (let l = 2; l < keysRl.length ; l++ ){
                                        Game.getObjectById(mRoom[labrooms[i]].labs[j].work_labs[keysRl[l]].id).runReaction(lab1, lab2);
                                    }
                                }
                                else{
                                    res_lab.runReaction(lab1, lab2);
                                }
                                
                                for( let b in mRoom[labrooms[i]].labs[j].work_labs){
                                    if(mRoom[labrooms[i]].labs[j].work_labs[b].boosting){
                                        let blab = Game.getObjectById(mRoom[labrooms[i]].labs[j].work_labs[b].id);
                                        if(blab.store.getUsedCapacity('energy') < 500){mRoom[labrooms[i]].labs[j].work_labs[b].eCritical = true}
                                        if(blab.store.getUsedCapacity('energy') > 1500){mRoom[labrooms[i]].labs[j].work_labs[b].eCritical = false}
                                        
                                        if(blab.store.getUsedCapacity(mRoom[labrooms[i]].labs[j].work_labs[b].res) < 500){mRoom[labrooms[i]].labs[j].work_labs[b].aCritical = true}
                                        if(blab.store.getUsedCapacity(mRoom[labrooms[i]].labs[j].work_labs[b].res) > 2500){mRoom[labrooms[i]].labs[j].work_labs[b].aCritical = false}
                                    }
                                }
                                
                            }
                        }
                    }                                                                                                   // конец если нужно провести реакцию
                    
                    if(mRoom[labrooms[i]].labs[j].boosting){                                                            // если нужно использовать лабораторию для улучшения крипа
                        delete mRoom[labrooms[i]].labs[j].rev_reaction;
                        delete mRoom[labrooms[i]].labs[j].run_reaction;
                        
                        if(mRoom[labrooms[i]].labs[j].work_labs == undefined){
                            mRoom[labrooms[i]].labs[j].work_labs = {
                                j: {
                                    eCritical: false,
                                    aCritical: false,
                                }
                            }
                        }
                        
                        for (let h in mRoom[labrooms[i]].labs[j].work_labs){
                            if(mRoom[labrooms[i]].labs[j].work_labs[h].res == undefined){
                                let res = _.find(RESOURCES_ALL, r=> r == h);
                                if(res && empty_labs.length > 0){
                                    mRoom[labrooms[i]].labs[j].work_labs[h].res = h;
                                    mRoom[labrooms[i]].labs[j].work_labs[h].id = empty_labs[0].id;
                                    empty_labs.shift();
                                }
                            }
                            else{
                                let tlab = Game.getObjectById(mRoom[labrooms[i]].labs[j].work_labs[h].id);
                                
                                if(tlab.store.getUsedCapacity('energy') < 500){mRoom[labrooms[i]].labs[j].work_labs[h].eCritical = true}
                                if(tlab.store.getUsedCapacity('energy') > 1500){mRoom[labrooms[i]].labs[j].work_labs[h].eCritical = false}
                                
                                if(tlab.store.getUsedCapacity(mRoom[labrooms[i]].labs[j].work_labs[h].res) < 500){mRoom[labrooms[i]].labs[j].work_labs[h].aCritical = true}
                                if(tlab.store.getUsedCapacity(mRoom[labrooms[i]].labs[j].work_labs[h].res) > 2000){mRoom[labrooms[i]].labs[j].work_labs[h].aCritical = false}
                            }
                        }
                    }
                    
                }
            }
        }
        //console.log(Game.cpu.getUsed() - cp);
    }

};

























