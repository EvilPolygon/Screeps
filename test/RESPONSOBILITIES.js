var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleTruck = require('role.truck');

module.exports = {
run: function(creep) {
    
    switch(creep.memory.role){
        case 'harvester':
             roleHarvester.run(creep); break;
        case 'upgrader':
            roleUpgrader.run(creep); break;
        case 'builder':
            roleBuilder.run(creep); break;
        case 'miner':
            roleMiner.run(creep); break;
        case 'truck':
            roleTruck.run(creep); break;
    }
}
};