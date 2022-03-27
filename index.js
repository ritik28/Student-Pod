//index.js
//Import Express
let express = require('express');
const multer = require('multer');
const path = require('path');
var cors = require('cors');
var fs = require('fs');
//import sqlite
const sqlite3 = require('sqlite3').verbose();
//Start App
let app = express();
// add cors
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
let db = new sqlite3.Database('./emp_database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the chinook database.');
  });
  
  db.serialize(() => {
    db.each(`SELECT `+`*`+ `
             FROM employees`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      console.log(row.employee_id + "\t" + row.first_name);
    });
  });
  
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });


//Import routes
let apiRoutes = require("./routes");
const { resolveMx } = require('dns');
//Assign port
var port = process.env.PORT || 8080;

//Use API routes in the App
app.use('/api', apiRoutes)
// Welcome message
app.get('/', (req, res) => res.send('Welcome to Express'));
let json = "[";

app.get('/admins',async (req, res)=> {
    let db = new sqlite3.Database('./emp_database.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the chinook database.');
      });
      let jsonres=[];
    db.serialize(() => {
         db.each(`SELECT * 
                 FROM admin`, (err, row) => {
                  if (err) {
                    console.error(err.message);
                  }
                  console.log(row.sid + "\t" + row.sname);
                  // res.json(row);
                  jsonres.push(row);
                });
              });
              db.close((err) => {
                if (err) {
                  console.error(err.message);
                }
                res.json(jsonres);
                console.log('Close the database connection.');
              });

} );

//admin get by the user name
// app.put('/admin', async (req, res, next)=> {
//   let db = new sqlite3.Database('./emp_database.db', (err) => {
//     if (err) {
//       // Cannot open database
//       console.error(err.message)
//       throw err
//     }else{
//         console.log('Connected to the SQLite database.')
//         db.run(``,
//         (err) => {
//             if (err) {
//                 // Table already created
//             }else{
//                 // Table just created, creating some rows
//                 // var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
//                 // db.run(insert, ["admin","admin@example.com",md5("admin123456")])
//                 // db.run(insert, ["user","user@example.com",md5("user123456")])
//             }
//         });  
//     }
// });

//   var data = {
//     aname: req.body.aname,
//     apass: req.body.apass,
//     sques: req.body.sques,
//     sans: req.body.sans
    
// }
// try {
//   var sql ='INSERT INTO Admin where aname = ? AND sques = ?'
//   var params =[data.aname, data.apass,data.sques,data.sans]
//    db.run(sql, params, function (err, result) {
//       if (err){
//           res.status(400).json({"error": err.message})
//           return;
//       }
//       res.json({
//           "message": "success",
//           "data": data,
//           "id" : this.lastID
//       })
//     });
//  console.log(req);
//  res.send(req);
//   }catch (e){
//     res.status("403");
//   }

// } );



app.get("/api/user/:id", (req, res, next) => {
  var sql = "select * from user where id = ?"
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":row
      })
    });
});

//for register

app.post('/adminreg', async (req, res, next)=> {
  //console.log(req.aname);
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log(req)
        // db.run(``,
        // (err) => {
        //     if (err) {
        //         // Table already created
        //     }else{
        //         // Table just created, creating some rows
        //         // var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
        //         // db.run(insert, ["admin","admin@example.com",md5("admin123456")])
        //         // db.run(insert, ["user","user@example.com",md5("user123456")])
        //     }
        // });  
    }
});

  var data = {
    aname: req.body.aname,
    apass: req.body.apass,
    sques: req.body.sques,
    sans: req.body.sans
    

}
try {
  console.log(data.aname);
  // var sql ='SELECT * FROM admin WHERE aname = "'+data.aname+'" AND sques = "'+data.sques+'" ';
  var sql = 'INSERT INTO admin (aname,apass,sques,sans) values(?,?,?,?); ';
  var params = [data.aname,data.apass,data.sques,data.sans];
  
  let jsonres=[];
  
      db.run(sql,params, (err, row) => {
        if (err) {
          console.error(err.message);
        }
        // console.log(row.aname + "\t" + row.sques);
      //   res.json({
      //     "message": row,
      //     "data": data,
      //     "id" : this.lastID
      // })
      });
    
    res.send(req);
  }catch (e){
    //res.status("403");
    res.send(e);
  }

} );



app.post('/admin', async (req, res, next)=> {
  console.log(req.aname);
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log(req)
        // db.run(``,
        // (err) => {
        //     if (err) {
        //         // Table already created
        //     }else{
        //         // Table just created, creating some rows
        //         // var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
        //         // db.run(insert, ["admin","admin@example.com",md5("admin123456")])
        //         // db.run(insert, ["user","user@example.com",md5("user123456")])
        //     }
        // });  
    }
});

  var data = {
    aname: req.body.aname,
    apass: req.body.apass,
    sques: req.body.sques,
    sans: req.body.sans
    

}
try {
  console.log(data.aname);
  // var sql ='SELECT * FROM admin WHERE aname = "'+data.aname+'" AND sques = "'+data.sques+'" ';
  var sql = 'update admin set apass = "'+data.apass+'" where aname = "'+data.aname+'" AND sques ="'+data.sques+'" ';
  
  let jsonres=[];
  
      db.run(sql, (err, row) => {
        if (err) {
          console.error(err.message);
        }
        // console.log(row.aname + "\t" + row.sques);
      //   res.json({
      //     "message": row,
      //     "data": data,
      //     "id" : this.lastID
      // })
      });
    
    res.send(req);
  }catch (e){
    //res.status("403");
    res.send(e);
  }

} );
//put admin
app.put('/adminx', async (req, res, next)=> {
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
        
    }
});
  //let id =  req.body.sid;
  var data = {
    aid:req.body.aid,
    aname: req.body.tname,
    apass: req.body.apass,
    sques: req.body.sques,
    sans:req.body.sans,

}
try {
  var sql ="UPDATE admin  SET aname = '"+req.body.aname+"', apass = '"+req.body.apass+"',sques = '"+req.body.sques+"', sans = '"+req.body.sans+"' WHERE aid = '"+req.body.aid+"' ";
  // console.log(sql);
  //var params =[data.sname, data.reg, data.course, data.fees, data.age, data.address , data.sid]
  //console.log(params);
   db.run(sql, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": result,
          "data": data,
          "id" : this.lastID
      })
    });
 //console.log(req);
 res.send(req);
  }catch (e){
    console.log(e);
    res.status("403");
  }

} );
//student calls
app.post('/student', async (req, res, next)=> {
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
          
    }
});

  var data = {
    sname: req.body.sname,
    reg: req.body.reg,
    course: req.body.course,
    fees: req.body.fees,
    age: req.body.age,
    address: req.body.address
    
}
try {
  var sql ='INSERT INTO student (sname, reg, course, fees, age, address) VALUES (?,?,?,?,?,?)'
  var params =[data.sname, data.reg, data.course, data.fees, data.age, data.address]
  console.log(params);
   db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      })
    });
 console.log(req);
 res.send(req);
  }catch (e){
    res.status("403");
  }

} );


//put student
app.put('/studentx', async (req, res, next)=> {
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
          
    }
});
  //let id =  req.body.sid;
  var data = {
    sname: req.body.sname,
    reg: req.body.reg,
    course: req.body.course,
    fees: req.body.fees,
    age: req.body.age,
    address: req.body.address,
    sid: req.body.sid
}
try {
  var sql ="UPDATE student  SET sname = '"+req.body.sname+"', reg = '"+req.body.reg+"',course = '"+req.body.course+"', fees = '"+req.body.fees+"',age = '"+req.body.age+"', address='"+req.body.address+"' WHERE sid = '"+req.body.sid+"' ";
  // console.log(sql);
  //var params =[data.sname, data.reg, data.course, data.fees, data.age, data.address , data.sid]
  //console.log(params);
   db.run(sql, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": result,
          "data": data,
          "id" : this.lastID
      })
    });
 //console.log(req);
 res.send(req);
  }catch (e){
    console.log(e);
    res.status("403");
  }

} );


//delete student
app.delete('/studentx', async (req, res, next)=> {
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
    }
});
  //let id =  req.body.sid;
  var data = {
    
    sid: req.body.sid
}
try {
  var sql ="DELETE FROM student WHERE sid = '"+req.body.sid+"' ";
  console.log(sql);
   db.run(sql, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": result,
          "data": data,
          "id" : this.lastID
      })
    });
 res.send(req);
  }catch (e){
    res.status("403");
  }

} );
//get student
app.get('/student',(req, res)=> {
  let db = new sqlite3.Database('./emp_database.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the chinook database.');
    });
    let jsonres=[];
    db.serialize(() => {
        db.each(`SELECT * 
                 FROM student`, (err, row) => {
          if (err) {
            console.error(err.message);
          }
          console.log(row.sid + "\t" + row.sname);
          // res.json(row);
          jsonres.push(row);
        });
      });
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      res.json(jsonres);
      console.log('Close the database connection.');
    });

} );


app.get("/api/user/:id", (req, res, next) => {
var sql = "select * from user where id = ?"
var params = [req.params.id]
db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
        "message":"success",
        "data":row
    })
  });
});

//Teacher apis

//post techer api
app.post('/teacher', async (req, res, next)=> {
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
          
    }
});

  var data = {
    tname: req.body.tname,
    reg: req.body.reg,
    subject1: req.body.subject1,
    subject2:req.body.subject2,
    salary: req.body.salary,
    age: req.body.age,
    address: req.body.address
    
}
try {
  var sql ='INSERT INTO teacher (tname, reg, subject1, subject2, salary, age, address) VALUES (?,?,?,?,?,?,?)'
  var params =[data.tname, data.reg, data.subject1, data.subject2, data.salary, data.age, data.address]
  console.log(params);
   db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      })
    });
 console.log(req);
 res.send(req);
  }catch (e){
    res.status("403");
  }

} );
//get teacher
app.get('/teacher',(req, res)=> {
  let db = new sqlite3.Database('./emp_database.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the chinook database.');
    });
  let jsonres=[];
  db.serialize(() => {
      db.each(`SELECT * 
               FROM teacher`, (err, row) => {
        if (err) {
          console.error(err.message);
        }
        console.log(row.sid + "\t" + row.sname);
        // res.json(row);
        jsonres.push(row);
      });
    });
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      res.json(jsonres);
      console.log('Close the database connection.');
    });

} );

//delete teacher 

app.delete('/teacherx', async (req, res, next)=> {
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
    }
});
  //let id =  req.body.sid;
  var data = {
    
    tid: req.body.tid
}
try {
  var sql ="DELETE FROM teacher WHERE tid = '"+req.body.tid+"' ";
  console.log(sql);
   db.run(sql, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": result,
          "data": data,
          "id" : this.lastID
      })
    });
 res.send(req);
  }catch (e){
    res.status("403");
  }

} );


//put teacher
app.put('/teacherx', async (req, res, next)=> {
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
        
    }
});
  //let id =  req.body.sid;
  var data = {
    tname: req.body.tname,
    reg: req.body.reg,
    subject1: req.body.subject1,
    subject2:req.body.subject2,
    salary: req.body.salary,
    age: req.body.age,
    address: req.body.address,
    tid: req.body.tid
}
try {
  var sql ="UPDATE teacher  SET tname = '"+req.body.tname+"', reg = '"+req.body.reg+"',subject1 = '"+req.body.subject1+"', subject2 = '"+req.body.subject2+"', salary = '"+req.body.salary+"',age = '"+req.body.age+"', address='"+req.body.address+"' WHERE tid = '"+req.body.tid+"' ";
  // console.log(sql);
  //var params =[data.sname, data.reg, data.course, data.fees, data.age, data.address , data.sid]
  //console.log(params);
   db.run(sql, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": result,
          "data": data,
          "id" : this.lastID
      })
    });
 //console.log(req);
 res.send(req);
  }catch (e){
    console.log(e);
    res.status("403");
  }

} );

//Syllabus
//get Syllabus
app.get('/syllabus',(req, res)=> {
  // let db = new sqlite3.Database('./emp_database.db', sqlite3.OPEN_READWRITE, (err) => {
  //     if (err) {
  //       console.error(err.message);
  //     }
  //     console.log('Connected to the chinook database.');
  //   });
  // let jsonres=[];
  // db.serialize(() => {
  //     db.each(`SELECT * 
  //              FROM student`, (err, row) => {
  //       if (err) {
  //         console.error(err.message);
  //       }
  //       console.log(row.sid + "\t" + row.sname);
  //       // res.json(row);
  //       jsonres.push(row);
  //     });
  //   });
  //   db.close((err) => {
  //     if (err) {
  //       console.error(err.message);
  //     }
  //     res.json(jsonres);
  //     console.log('Close the database connection.');
  //   });


let json1 = {};
  const directoryPath = path.join(__dirname, 'syllabus');
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 
      //listing all files using forEach
      files.forEach(function (file,index) {
          // Do whatever you want to do with the file
          console.log(file); 
         json1["val"+index]= file;
      });
      console.log(json1);
      // json1 += JSON.stringify(json1);
      res.json(json1);
  });


} );

//course
//post course api
app.post('/course', async (req, res, next)=> {
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
          
    }
});

  var data = {
    cname: req.body.cname,
    subject1: req.body.subject1,
    subject2:req.body.subject2,
    subject3: req.body.subject3,
    subject4:req.body.subject4,
    subject5: req.body.subject5,
    subject6:req.body.subject6,
    duration: req.body.duration
    
    
}
try {
  var sql ='INSERT INTO course (cname, subject1, subject2, subject3, subject4, subject5, subject6, duration) VALUES (?,?,?,?,?,?,?,?)'
  var params =[data.cname, data.subject1, data.subject2, data.subject3, data.subject4, data.subject5, data.subject6, data.duration]
  console.log(params);
   db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      })
    });
 console.log(req);
 res.send(req);
  }catch (e){
    res.status("403");
  }

} );
//get teacher
app.get('/course',(req, res)=> {
  let db = new sqlite3.Database('./emp_database.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the chinook database.');
    });
  let jsonres=[];
  db.serialize(() => {
      db.each(`SELECT * 
               FROM course`, (err, row) => {
        if (err) {
          console.error(err.message);
        }
        console.log(row.sid + "\t" + row.sname);
        // res.json(row);
        jsonres.push(row);
      });
    });
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      res.json(jsonres);
      console.log('Close the database connection.');
    });

} );

//delete teacher 

app.delete('/coursex', async (req, res, next)=> {
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
    }
});
  //let id =  req.body.sid;
  var data = {
    
    cid: req.body.cid
}
try {
  var sql ="DELETE FROM course WHERE cid = '"+req.body.cid+"' ";
  console.log(sql);
   db.run(sql, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": result,
          "data": data,
          "id" : this.lastID
      })
    });
 res.send(req);
  }catch (e){
    res.status("403");
  }

} );


//put teacher
app.put('/coursex', async (req, res, next)=> {
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
        
    }
});
  //let id =  req.body.sid;
  var data = {
    cname: req.body.cname,
    subject1: req.body.subject1,
    subject2:req.body.subject2,
    subject3: req.body.subject3,
    subject4:req.body.subject4,
    subject5: req.body.subject5,
    subject6:req.body.subject6,
    duration: req.body.duration,
    cid:req.body.cid
}
try {
  var sql ="UPDATE course  SET cname = '"+req.body.cname+"', subject1 = '"+req.body.subject1+"',subject2 = '"+req.body.subject2+"', subject3 = '"+req.body.subject3+"',subject4 = '"+req.body.subject4+"',subject5 = '"+req.body.subject5+"',subject6 = '"+req.body.subject6+"', duration = '"+req.body.duration+"' WHERE cid = '"+req.body.cid+"' ";
  // console.log(sql);
  //var params =[data.sname, data.reg, data.course, data.fees, data.age, data.address , data.sid]
  //console.log(params);
   db.run(sql, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": result,
          "data": data,
          "id" : this.lastID
      })
    });
 //console.log(req);
 res.send(req);
  }catch (e){
    console.log(e);
    res.status("403");
  }

} );

//file upload for the syllasbus and notes

// Video Upload
const videoStorage = multer.diskStorage({
  destination: './videos', // Destination to store video 
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
  }
});
// files Upload
const fileStorage = multer.diskStorage({
  destination: './syllabus', // Destination to store video 
  filename: (req, file, cb) => {
      console.log(file.filename);
      // cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
      cb(null, file.originalname);
  }
});


const noteStorage = multer.diskStorage({
  destination: './notes', // Destination to store video 
  filename: (req, file, cb) => {
      console.log(file.filename);
      // cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
      cb(null, file.originalname);
  }
});



const videoUpload = multer({
  storage: videoStorage,
  limits: {
      fileSize: 1000000000   // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(mp4|MPEG-4)$/)) {     // upload only mp4 and mkv format
          return cb(new Error('Please upload a Video'))
      }
      cb(undefined, true)
  }
})



const documentUpload = multer({
  storage: fileStorage,
  limits: {
      fileSize: 1000000000   // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(pdf|docx|doc|ppt|epub)$/)) {     // upload only mp4 and mkv format
          return cb(new Error('Please upload a Video'))
      }
      cb(undefined, true)
  }
})


const noteUpload = multer({
  storage: noteStorage,
  limits: {
      fileSize: 1000000000   // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(pdf|doc|ppt|epub)$/)) {     // upload only mp4 and mkv format
          return cb(new Error('Please upload a Video'))
      }
      cb(undefined, true)
  }
})
//NotesUpload
app.post('/uploadNotes', noteUpload.single('file'), (req, res) => {
  res.send(req.file)
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
});

//Get Notes

//get Syllabus
app.get('/Notes',(req, res)=> {



let json1 = {};
  const directoryPath = path.join(__dirname, 'notes');
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 
      //listing all files using forEach
      files.forEach(function (file,index) {
          // Do whatever you want to do with the file
          console.log(file); 
         json1["val"+index]= file;
      });
      console.log(json1);
      // json1 += JSON.stringify(json1);
      res.json(json1);
  });


} );





//videoupload
app.post('/uploadVideo', videoUpload.single('video'), (req, res) => {
  
  res.send(req.file);
  console.log(req.file);
  
  let db = new sqlite3.Database('./emp_database.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.');
    }
});
var data = {
  
  vname: req.body.vname,
  vtag:req.body.vtag,
  vcourse: req.body.vcourse,
  loc:req.file.path
  
  
}
try {
var sql ='INSERT INTO vtutorial (vname, vtag, vcourse, loc) VALUES (?,?,?,?)'
var params =[data.vname,data.vtag,data.vcourse,data.loc]
console.log(params);
 db.run(sql, params, function (err, result) {
    if (err){
        res.status(400).json({"error": err.message})
        return;
    }
    // res.json({
    //     "message": "success",
    //     "data": data,
    //     "id" : this.lastID
    // })
  });
//console.log(req);
//res.send(req);
}catch (e){
  res.status("403");
}


}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
});





//SyllabusUpload
app.post('/uploadSyllabus', documentUpload.single('file'), (req, res) => {
  res.send(req.file)
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
});


//get upload video
app.get('/uploadVideo',(req, res)=> {
  let db = new sqlite3.Database('./emp_database.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the chinook database.');
    });
  let jsonres=[];
  db.serialize(() => {
      db.each(`SELECT * 
               FROM vtutorial`, (err, row) => {
        if (err) {
          console.error(err.message);
        }
        console.log(row.sid + "\t" + row.sname);
        // res.json(row);
        jsonres.push(row);
      });
    });
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      res.json(jsonres);
      console.log('Close the database connection.');
    });

} );

//Notice Board

//OCR

const { createWorker } = require('tesseract.js');

const worker = createWorker();

  (async () => {
  await worker.load();
  await worker.loadLanguage('eng+deu+spa+osd+fra');
  await worker.initialize('eng+deu+spa+osd+fra');
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();



// Launch app to the specified port
app.listen(port, function() {
    console.log("Running XAPI on Port "+ port);
})