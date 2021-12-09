const express = require("express");
const Student = require("../Models/student");
const router = express.Router();

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    // Generate random number
    var j = Math.floor(Math.random() * (i + 1));

    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

// let total_Skills = ["C", "C++", "Javascript", "Java", "Python"];
// // add student
// router.post("/add", async (req, res) => {
//   let new_student;
//   // res.send("done");

//   for (let k = 4; k < 100; k++) {
//     let count = 100 * k + 1;
//     for (let i = 0; i < 100; i++) {
//       // let k = i + 1;
//       let temp = [];
//       let temp2 = shuffleArray(total_Skills);
//       // console.log(temp2);
//       let s = Math.random() * total_Skills.length;
//       // console.log(s);
//       for (let j = 0; j < s; j++) {
//         temp.push(temp2[j]);
//       }
//       temp.sort();
//       // console.log(temp);
//       new_student = new Student({
//         id: count,
//         name: "Student" + count,
//         Year_Of_Batch: 2018,
//         College_ID: k + 1,
//         Skills: temp,
//       });

//       try {
//         await new_student.save();
//       } catch (err) {
//         console.log("error");
//       }
//       count++;
//     }
//   }

//   res.json({ student: new_student.toObject({ getters: true }) });
// });

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  let studentsList;
  try {
    studentsList = await Student.find({ id: id });
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

module.exports = router;
