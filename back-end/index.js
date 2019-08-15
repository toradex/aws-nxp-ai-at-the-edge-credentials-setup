'use strict';

const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');

// This files must be bind-mount from /greengrass
const config_fname = "/config.json"
const conf_file = require(config_fname);

// I've been told to never hardcode pwd, but this is just a demo
const pwd_hash = "48d276aee5a23692e14fad275890a3b1baba8a3b620dee920d674f04cf54186a";

app.use(fileUpload());
app.use( bodyParser.json() );

app.options('*', cors());

app.options('/save', cors())
app.post('/save', cors(), (req, res) => {
    if (req.body.password === pwd_hash){
        conf_file.coreThing.thingArn = req.body.thingArn;
        conf_file.coreThing.iotHost = req.body.iotHost + "-ats.iot." +
                                        req.body.awsRegion + ".amazonaws.com";
        conf_file.coreThing.ggHost = "greengrass-ats.iot." +
                                        req.body.awsRegion + ".amazonaws.com";

        fs.writeFile(config_fname, JSON.stringify(conf_file, null, 2), function (err) {
            if (err) {
                res.status(500).send(false)
                return console.log(err);
            }
            res.send(true)
        });
    }
    else {
        res.status(401).send(false)
    }
})

app.options('/cert-pem', cors())
app.post('/cert-pem', cors(), (req, res) => {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
  
    let pem = req.files.pem;
    conf_file.coreThing.certPath = pem.name;
    conf_file.crypto.principals.IoTCertificate.certificatePath = 
                "file:///greengrass/certs/" + pem.name;

    pem.mv('/greengrass/certs/' + pem.name, function(err) {
        if (err){
            console.log("Unable to copy file!");
            return res.status(500).send(err);
        }
            

        fs.writeFile(config_fname, JSON.stringify(conf_file, null, 2), function (err) {
            if (err) {
                res.status(500).send(false)
                return console.log(err);
            }
            res.send(true)
        });
    });
});

app.options('/cert-priv-key', cors())
app.post('/cert-priv-key', cors(), (req, res) => {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
  
    let privkey = req.files.privkey;
    conf_file.coreThing.keyPath = privkey.name;
    conf_file.crypto.principals.IoTCertificate.privateKeyPath = 
                "file:///greengrass/certs/" + privkey.name;
    conf_file.crypto.principals.SecretsManager.privateKeyPath = 
                "file:///greengrass/certs/" + privkey.name;

    privkey.mv('/greengrass/certs/' + privkey.name, function(err) {
        if (err){
            console.log("Unable to copy file!");
            return res.status(500).send(err);
        }

        fs.writeFile(config_fname, JSON.stringify(conf_file, null, 2), function (err) {
            if (err) {
                res.status(500).send(false)
                return console.log(err);
            }
            res.send(true)
        });
    });
});

app.options('/disable', cors())
app.post('/disable', cors(), (req, res) => {
    if (req.body.disable === true){
        console.log("Disabling the update service forever");
    }
    else {
        res.status(401).send(false);
    }
});

app.listen(port, () => console.log(`Back-end listening on ${port}!`))