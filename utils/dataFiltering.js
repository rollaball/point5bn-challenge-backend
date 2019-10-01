const filterThroughFields = (schools, params) => {
  return schools.filter(school => {
    if(params.category){
      if(school.category !== params.category) {
        return false;
      }
    }
    if(params.gender){
      if(school.gender !== params.gender) {
        return false;
      }
    }
    if(params.medium_of_inst){
      if(school.medium_of_inst !== params.medium_of_inst) {
        return false;
      }
    }
    return true;
  })
}


module.exports = { filterThroughFields };
