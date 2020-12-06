var roleDigger = require('role.LoneDigger');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var Economical = require('mod.economical');
var roleClaimer = require('role.claimer');
var Offense = require('mod.offense');

module.exports = {
run: function(creep) {
    
    switch(creep.memory.role){
        case 'LoneDigger':{
             roleDigger.run(creep); break;}
        case 'upgrader':{
            roleUpgrader.run(creep); break;}
        case 'builder':{
            roleBuilder.run(creep); break;}
        case 'claimer' :{
            roleClaimer.run(creep); break;}
    }
    
    switch (creep.memory.Type){
        case 'economical':{
            Economical.run(creep); break;}
        case 'offense':{
            Offense.run(creep); break;
        }
    }
}
};