const { response } = require("express");
const express = require("express");
const College = require("../Models/college");
const Student = require("../Models/student");

const router = express.Router();

let courses = [];

// add college
// router.post("/add", async (req, res) => {
//   let new_college;
//   let temp = 71;
//   for (let i = 0; i < 30; i++) {
//     let k = Math.floor(i / 2);
//     let c = (i % 6) + 21;
//     new_college = new College({
//       id: temp,
//       name: "College" + temp,
//       Year_Founded: 2001,
//       City: "City" + c,
//       State: "State6",
//       Country: "India",
//       Total_Students: 1000 + k * 100,
//       Courses: ["CS", "IT", "ECE", "EE"],
//     });
//     temp++;
//     try {
//       await new_college.save();
//     } catch (err) {
//       console.log("error");
//     }
//   }
//   res.json({ college: new_college.toObject({ getters: true }) });
// });

router.get("/get_list", async (req, res) => {
  //get list of colleges
  let temp_college;
  try {
    temp_college = await College.find();
  } catch (err) {
    console.log(err);
  }

  temp_college.forEach((item) => {
    item.Courses.forEach((course) => {
      if (!courses.includes(course)) {
        courses.push(course);
      }
    });
  });
  let collegeCountByCourses = [];
  // console.log(courses);
  let count = await College.countDocuments();
  await Promise.all(
    courses.map(async (item) => {
      // console.log(item);
      let list = await College.find({ Courses: item });
      // console.log(list);
      collegeCountByCourses.push({
        courseName: item,
        collegeList: ((list.length * 100) / count).toFixed(2),
      });
    })
  );
  // console.log(collegeCountByCourses);

  res.json({
    colleges: temp_college.map((college) =>
      college.toObject({ getters: true })
    ),
    collegeCountByCourses: collegeCountByCourses,
  });
});

// router.get("/ids", async (req, res) => {
//   let temp_list;
//   try {
//     temp_list = await College.find();
//   } catch (err) {
//     console.log(err);
//   }

//   let idList = [];

//   temp_list.map((college) => {
//     college.toObject({ getters: true });
//     // console.log(college);
//     // console.log(typeof college);
//     let temp_obj = {};
//     temp_obj.name = college.name;
//     temp_obj.id = college._id;
//     idList.push(temp_obj);
//   });
//   //   console.log(idList);
//   res.json({ list: idList.map((list) => list) });
// });

router.get("/id/:id", async (req, res) => {
  // get college by id
  const id = parseInt(req.params.id);
  // console.log(typeof id);

  let college;
  try {
    college = await College.find({ id: id });
  } catch (err) {
    console.log(err);
    res.send("some error");
  }

  // console.log(typeof college);
  res.json({ college: college });
});

//get college by name

router.get("/name/:name", async (req, res) => {
  const name = req.params.name;
  // console.log(name);
  let college;
  try {
    college = await College.find({ name: name });
  } catch (err) {
    console.log(err);
    res.send("some error");
  }

  // console.log(college);
  res.json({ college: college });
});

//similar colleges

router.get("/similar/:id", async (req, res) => {
  // const name = req.params.name;
  // console.log(name);

  const id = req.params.id;

  let college;

  try {
    college = await College.findOne({ id: id });
  } catch (err) {
    console.log(err);
  }
  // console.log(college.City);
  let city_colleges;
  try {
    city_colleges = await College.find({ City: college.City });
  } catch (err) {
    console.log(err);
    res.send("some error");
  }

  let state_colleges;
  try {
    state_colleges = await College.find({ State: college.State });
  } catch (err) {
    console.log(err);
    res.send("some error");
  }

  city_colleges = city_colleges.filter((college) => {
    return college.id != id;
  });

  state_colleges = state_colleges.filter((college) => {
    return college.id != id;
  });

  let students = college.Total_Students;

  let sameNumberOfStudents_college;

  try {
    sameNumberOfStudents_college = await College.find({})
      .where("Total_Students")
      .gt(students - 101)
      .lt(students + 101);
  } catch (err) {
    console.log(err);
  }

  // console.log(sameNumberOfStudents_college);

  sameNumberOfStudents_college = sameNumberOfStudents_college.filter(
    (college) => {
      return college.id != id;
    }
  );
  let finalData = [];

  city_colleges.forEach((item) => {
    finalData.push(item);
  });

  state_colleges.forEach((item) => {
    finalData.push(item);
  });

  sameNumberOfStudents_college.forEach((item) => {
    finalData.push(item);
  });

  // console.log(city_colleges);
  res.json({
    colleges: finalData,
  });
});

//get list of student from a particular college

router.get("/student-list/:id", async (req, res) => {
  const id = req.params.id;
  let studentsList;
  try {
    studentsList = await Student.find({ College_ID: id });
    // console.log(studentsList);
  } catch (err) {
    console.log(err);
  }
  res.json({
    Students: studentsList.map((student) =>
      student.toObject({ getters: true })
    ),
  });
});

router.get("/by_state", async (req, res) => {
  let colleges_by_states = [];

  let count = await College.countDocuments();

  // console.log(count);

  const result = await College.aggregate([
    {
      $group: {
        _id: { State: "$State" },
        college_count: { $sum: 1 },
      },
    },
  ]);
  // .then((result) => {
  //   console.log(result);
  //   colleges_by_states = result;
  // })
  // .catch((error) => {
  //   console.log(error);
  // });

  // console.log(result);

  result.forEach((item) => {
    colleges_by_states.push({
      State: item._id.State,
      percentage: ((item.college_count * 100) / count).toFixed(2),
    });
  });

  // colleges_by_states = result;
  res.json({
    colleges_by_states: colleges_by_states.map((college) => college),
  });
});

router.get("/state/:name", async (req, res) => {
  const name = req.params.name;
  let colleges = [];
  console.log(name);
  try {
    const response = await College.find({ State: name });
    colleges = response;
    // console.log(response.length);
  } catch (error) {
    console.log(error);
    // res.status({ code: 404, msg: "not found" });
  }

  res.send({
    colleges: colleges.map((college) => college.toObject({ getters: true })),
  });
});

router.get("/course/:name", async (req, res) => {
  const name = req.params.name;
  let collegeList = [];

  try {
    let responseData = await College.find({ Courses: name });
    // console.log(responseData);
    collegeList = responseData;
    // console.log(responseData.length);
  } catch (error) {
    console.log(error);
  }
  res.json({
    collegeList: collegeList.map((college) =>
      college.toObject({ getters: true })
    ),
  });
});

module.exports = router;
