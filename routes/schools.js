var express = require("express");
var router = express.Router();
const path = require("path");
const parse = require("csv-parse/lib/sync");
var fs = require("fs");
const { filterThroughFields } = require("../utils/dataFiltering")
const fileData = fs.readFileSync(
  path.resolve(__dirname, "../data/Bangalore_schools.csv"),
  "utf8"
);
const schools = parse(fileData, {
  columns: true,
  skip_empty_lines: true,
  delimiter: "|"
});
router.get("/", function(req, res) {
  const { sortBy, page, searchString, pageSize, sortOrder } = req.query;
  
  const sortedSchools = sortBy
    ? schools.sort((s1, s2) => {
      if(sortOrder==="asc") {
        if(s1[sortBy] < s2[sortBy]){
          return -1
        }
        return 1;
      }
      if(s1[sortBy] > s2[sortBy]){
        return -1;
      }
      return 1
    })
    : schools;
    //first filter using seach string
  const filteredSchools = searchString
    ? sortedSchools.filter(school => {
        if (
          school.schoolname.indexOf(searchString) >= 0 ||
          school.address.indexOf(searchString) >= 0 ||
          school.area.indexOf(searchString) >= 0 ||
          school.pincode.indexOf(searchString) >= 0 ||
          school.landmark.indexOf(searchString) >= 0
        ) {
          return true;
        }
        return false;
      })
    : sortedSchools;
  // filter using category gender and medium of institute
  const dynamicallyFilteredData = filterThroughFields(filteredSchools, req.query)
  // return data to the respected page size and number
  const pagedSchools =
    page && pageSize
      ? dynamicallyFilteredData.slice(page * pageSize, (Number(page) + 1) * pageSize)
      : dynamicallyFilteredData;
  res.set({
    'Access-Control-Expose-Headers': 'X-page-count',
    'X-page-count': Math.ceil(dynamicallyFilteredData.length/10),
  })
  res.send(pagedSchools);
});

module.exports = router;
