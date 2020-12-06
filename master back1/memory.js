module.exports = {
    
    run: function(){
        
        Memory.Economical_Report.Ticks_for_next_report--;
        if(Memory.Economical_Report.Ticks_for_next_report <= 0){
            for (let i in Game.rooms){//console.log(Game.rooms[i].find(FIND_MY_SPAWNS).length > 0);
                if(Game.rooms[i].find(FIND_MY_SPAWNS).length > 0){
                    if(Game.rooms[i].storage != undefined){
                        if(Memory.Economical_Report.Rooms[i] == undefined){
                            Memory.Economical_Report.Rooms[i] = {prevAmount:0, currAmount:Game.rooms[i].storage.store.getUsedCapacity(RESOURCE_ENERGY)};
                            Memory.Economical_Report.Rooms[i].donor_sent = (_.filter(Game.creeps,  (creep) => (creep.memory.role == 'donor') && (creep.memory.to == i))).length >= 1;
                        }
                        else{
                            Memory.Economical_Report.Rooms[i].prevAmount = Memory.Economical_Report.Rooms[i].currAmount;
                            Memory.Economical_Report.Rooms[i].currAmount = Game.rooms[i].storage.store.getUsedCapacity(RESOURCE_ENERGY);
                            Memory.Economical_Report.Rooms[i].income = Memory.Economical_Report.Rooms[i].currAmount - Memory.Economical_Report.Rooms[i].prevAmount;
                            Memory.Economical_Report.Rooms[i].donor_sent = (_.filter(Game.creeps,  (creep) => (creep.memory.role == 'donor') && (creep.memory.to == i))).length >= 1;
                        }
                    }
                    else{
                        Memory.Economical_Report.Rooms[i] ={};
                        Memory.Economical_Report.Rooms[i].currAmount = 0;
                        Memory.Economical_Report.Rooms[i].donor_sent = (_.filter(Game.creeps,  (creep) => (creep.memory.role == 'donor') && (creep.memory.to == i))).length >= 1;
                    }
                }
            }
            Memory.Economical_Report.Ticks_for_next_report = 100;
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
            
            //--------------------- LINKS ------------------
            //let cp = Game.cpu.getUsed();
            let links = Game.rooms[i].find(FIND_STRUCTURES,{filter: structure => structure.structureType == STRUCTURE_LINK});
            
            //  && CONTROLLER_STRUCTURES.link[Game.rooms[i].controller.level] > links.length
            if(links.length >0){
                delete Game.rooms[i].memory.links;
                if(Game.rooms[i].memory.links == undefined){
                    Game.rooms[i].memory.links = [];
                }
                let For_Links_Memory = [];
                let nearestObj = Game.rooms[i].find(FIND_STRUCTURES, {filter: structure => 
                    structure.structureType == 'storage' });
                    
                    Game.rooms[i].find(FIND_SOURCES).forEach(src =>{src.structureType = 'source'; nearestObj.push(src)});
                    nearestObj.push(Game.rooms[i].controller);
                    
                    for (let j in links){
                        let nearest = links[j].pos.findClosestByRange(nearestObj);
                        if(nearest.structureType != 'source'){
                            Game.rooms[i].memory.links.push({id: links[j].id, position: links[j].pos, linkType: nearest.structureType});
                        }
                        else{
                            Game.rooms[i].memory.links.push({id: links[j].id,sourceID: nearest.id, position: links[j].pos, linkType: nearest.structureType});
                        }
                    }
            }
            
            
            if(Game.rooms[i].memory.links != undefined){
                
                let linkStorage;
                let linkSources = [];
                let linkController;
                
                let link =Game.rooms[i].memory.links;
                
                for (let j in link){
                    
                    if( link[j].linkType == 'storage'){
                        linkStorage = {id: link[j].id, pos:link[j].position};
                    }
                    
                    if( link[j].linkType == 'controller'){
                        linkController = {id: link[j].id, pos: link[j].position};
                    }
                    
                    if (link[j].linkType == 'source' ){
                        linkSources.push({id:link[j].id, pos: link[j].position});
                    }
                }
                
                if(linkStorage != undefined && linkController != undefined){
                    let linkstor = Game.getObjectById(linkStorage.id);
                    let linkcont = Game.getObjectById(linkController.id);
                    
                    if(linkController != undefined && linkcont.store.getFreeCapacity(RESOURCE_ENERGY) >300){
                        linkstor.transferEnergy(linkcont, (linkcont.store.getFreeCapacity(RESOURCE_ENERGY) > linkstor.store.getUsedCapacity(RESOURCE_ENERGY) ? linkstor.store.getUsedCapacity(RESOURCE_ENERGY) : linkcont.store.getFreeCapacity(RESOURCE_ENERGY)));
                    }
                    //var cp = Game.cpu.getUsed();
                    //console.log(linkSources.length);
                    if(linkSources.length >0){
                        linkSources.forEach(fromlink => {
                            let srclink = Game.getObjectById(fromlink.id);
                            if(srclink.store.getUsedCapacity(RESOURCE_ENERGY) >300){
                                srclink.transferEnergy(linkstor, 300);
                            }
                        })
                    }
                }
                
            }
            //-------------------- END LINKS --------------------------
            
        }
        
        //-------------------------offenseINFO-------------------------
        for (let i in Memory.offenseINFO){
            if((Object.keys(Memory.offenseINFO[i])).length == 0){
                Memory.offenseINFO[i]={
                    min_group:10,
                    Turtles_send: false,
                    needed_Turtles:5,
                    Avangard_send: false,
                    needed_Avangard:7,
                    Dismantlers_send:false,
                    needed_Dismantlers:5,
                    avoid_rooms:[],
                    Group_room:false,
                    READY:false,
                    ticks_to_check:300,
                    send_marauders:false,
                    info_for_maradeurs:{
                        tRoom:i,
                        needed_marauders:5,
                        min_live:500,
                    }
                }
            }
            
            if(Memory.offenseINFO[i].ticks_to_check < 0 ){
                if(Game.rooms[Memory.offenseINFO[i].Group_room] != undefined){
                    Memory.offenseINFO[i].READY = Game.rooms[Memory.offenseINFO[i].Group_room].find(FIND_MY_CREEPS, {filter: cr=> cr.memory.Type == 'offense'}).length > Memory.offenseINFO[i].min_group;
                    Memory.offenseINFO[i].ticks_to_check = 100;
                }
                else{
                    Memory.offenseINFO[i].READY = false;
                    Memory.offenseINFO[i].ticks_to_check = 100;
                }
            }
            
            Memory.offenseINFO[i].ticks_to_check--;
        }
        //-------------------------------------------------------------
        
        
        //-------------------- CLAIMERS INFO ----------------------
           /*if(Memory.claimersINFO[0] == null){
               Memory.claimersINFO.Rooms= [];
           }*/

        for ( let i in Memory.creeps){
            if (!Game.creeps[i]){
                delete Memory.creeps[i];
            }
        }
    }

};