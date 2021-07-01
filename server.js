const express = require("express");
//const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("./connection");
const Userdata = require("./userschema");
const userData = require("./userschema");
const app = express();

app.use(express.json());
const jwtkey = "samplejsonwebtoken";
//console.log(process.env.PORT,process.env.MONGOURI)

app.get("/api/allUsers", async (req, res) => {
  try {
    const userDetailsSchema = await Userdata.find({});
    res.send(userDetailsSchema);
  } catch (error) {
    res.status(500);
  }
});

app.get("/api/finduser/:emailid", async (req, res) => {
  try {
    await Userdata.findOne({ useremail: req.params.emailid }).then(
      (useremaildata) => {
        res.status(200).send(useremaildata);
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/api/searchuser/:name", async (req, res) => {
  try {
    const regex = new RegExp(req.params.name, "i");
    await userData.find({ username: regex }).then((result) => {
      res.status(200).send(result);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/api/registeruser", async (req, res) => {
  const userDetailsSchema = new userData({
    username: req.body.username,
    useremail: req.body.useremail,
    userpasswd: req.body.userpasswd,
  });

  try {
    await userDetailsSchema.save().then((result) => {
      jwt.sign(
        { userDetailsSchema },
        jwtkey,
        { expiresIn: "300s" },
        (err, token) => {
          res.status(201).send(result);
        }
      );
    });
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post("/api/login", async (req, res) => {
  const email = req.body.useremail;
  const passwd = req.body.userpasswd;

  try {
    const useremailid = await userData.findOne({ useremail: email });
    // console.log(passwd+" , "+useremailid.userpasswd);
    const isMatch = await bcrypt.compare(passwd, useremailid.userpasswd);
    // console.log(isMatch);
    if (isMatch) {
      jwt.sign({ useremailid }, jwtkey, { expiresIn: "300s" }, (err, token) => {
        res.status(200).json({ token });
      });
    } else {
      res.send("password is invalid");
    }
  } catch (error) {
    res.status(400).send("Invalid Login details provided");
  }
});
app.put("/api/updateuser/:emailid", async (req, res) => {
  try {
    await Userdata.findOneAndUpdate(
      { useremail: req.params.emailid },
      {
        $set: {
          username: req.body.username,
          useremail: req.body.useremail,
          userpasswd: req.body.userpasswd,
        },
      },
      {
        new: true,
      }
    ).then((result) => {
      res.status(201).send(result);
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
app.delete("/api/deleteuser/:emailid", async (req, res) => {
  try {
    Userdata.findOneAndDelete({ useremail: req.params.emailid }).then(
      (data) => {
        res.status(200).send(data);
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

// https://www.youtube.com/watch?v=HnQUzKqJSlU&list=PL8p2I9GklV44X970xDCQvts19-0XQWMeA&index=43
function verifytoken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    req.token = bearer[1];

    jwt.verify(req.token, jwtkey, (err, authdata) => {
      if (err) {
        res.send(err);
      } else {
        next();
      }
    });
  } else {
    res.status(401).send("Token not provided");
  }
}

app.listen(3001, () => {
  console.log("listening on port 3001...");
});
