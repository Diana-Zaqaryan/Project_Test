const sectros = require('./sector.json');
const status = require('./status.json');
const country= require('./country.json');
const project= require('./project.json');
const district= require('./districts.json');
const projectLocation= require('./projectLocation.json');
const sectorProject= require('./sector-project.json');


module.exports = () => ({
  sector: sectros,
  status: status,
  country: country,
  project: project,
  projectLocation: projectLocation,
  district: district,
  sectorProject: sectorProject

});
