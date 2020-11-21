const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const path = require("path");
var table = require("./user");
const app = express();

const vi = path.join(__dirname, "../templates/views");

app.set("view engine", "hbs");
app.set("views", vi);

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json());


mongoose.connect("mongodb://localhost:27017/user", { useUnifiedTopology: true, useNewUrlParser: true })
.then( () => {
    console.log("database connected");
}).catch( (err) => {
    console.log("database not connected");
});

app.get("/" , (req, res) => {
    res.render("home");
});

app.get("/reg" , (req, res) => {
    res.render("register");
});

app.get("/forgot-pass", (req, res) => {
    res.render("forgotpass");
})

app.post("/reset-pass", (req, res) => {
    const usname = req.body.uname;
    table.findOne({ username: usname }, (err, found) => {
        if(!found) {
            res.render("forgotpass", {
                x: "user not found",
            });
        } else {
            return res.render("resetpass", {
                ok: usname,
            });
        }
    })
})

app.post("/reset-password", (req, res) => {
    const ps = req.body.newpass;
    const cps = req.body.confirmpass;
    const un = req.body.uname;
    if(ps == cps) {
        table.updateOne({ username: un}, { $set: { password: ps } }, (err, done) => {
            if(done){
                return res.render("home", {
                    x: "now you can login",
                })
            }
        })
    } else {
        return res.render("forgotpass", {
            x: "password and confirm password does not match",
        })
    }
})

app.get("/change-pass", (req, res) => {
    return res.render("changepass");
})

app.post("/change-password", (req, res) => {
    const usern = req.body.uname;
    const oldp = req.body.oldpass;
    const newp = req.body.newpass;
    const conp = req.body.confirmpass;
    if(newp == conp){
        table.updateOne({ username: usern, password: oldp}, { $set: { password: newp}}, (err, done) => {
            if(done){
                return res.render("home", {
                    x: "You need to login again. Because you change the password",
                })
            } else {
                res.render("changepass");
            }
        })
    } else {
        return res.render("changepass", {
            x: "newpass and confirm password doesn't match.",
        })
    }
})

app.post("/reg-user", (req, res) => {
    if (req.body.pass == req.body.cpass){
        const first = req.body.fname;
        const last = req.body.lname;
        const usern = req.body.uname;
        const passw = req.body.pass;
        const user = new table();
        user.firstname = first;
        user.lastname = last;
        user.username = usern;
        user.password = passw;
    
        user.save((err, saved) => {
            if(err) {
                return res.render("register",{
                    usercheck : "username is already taken",
                })
            } else {
                return res.render("home", {
                    x : "now you can login",
                })
            }
        })

    } else {
        res.render("register", {
            usercheck : "password and confirm password doesn't match"
        })
    }
})

app.post("/login-auth", (req, res) => {
    var us = req.body.uname;
    var ps = req.body.pass;
    table.findOne({ username: us, password: ps}, (err, found) => {
        if(err){
            console.log("err");
            
        }
        if(!found) {
            return res.render("home", {
                x: "username and password doesn't match",
            });
        } else {
            return res.render("main", {
                name : us,
            })
        }
    })
})

app.listen(8000, () => {
    console.log("server started");
});