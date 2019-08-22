'use strict';

const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');

// This files must be bind-mount from /greengrass
const config_fname = "/greengrass/config/config.json"
const conf_file = require(config_fname);

app.use(fileUpload());
app.use( bodyParser.json() );

app.options('*', cors());

app.options('/bundle-tar', cors())
app.post('/bundle-tar', cors(), (req, res) => {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let bundletar = req.files.tar;

    bundletar.mv("/greengrass/config/" + bundletar.name, function(err) {
        if (err){
            console.log("Unable to copy file!");
            return res.status(500).send(err);
        }
        require('child_process').exec('tar -C /greengrass/ -zxf /greengrass/config/' + bundletar.name, function(err) {
            if (err){
                console.log("Unable to copy file!");
                return res.status(500).send(err);
            }
            require('child_process').exec('rm /greengrass/config/' + bundletar.name, function(err) {
                if (err) {
                    return res.status(500).send(err);
                }
            });
        });
        res.send(true)
    });
});

app.options('/conf-json', cors())
app.post('/conf-json', cors(), (req, res) => {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let confjson = req.files.confjson;

    confjson.mv(config_fname, function(err) {
        if (err){
            console.log("Unable to copy file!");
            return res.status(500).send(err);
        }
        res.send(true)
    });
});

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
        fs.writeFile('/greengrass/config/config.disable', 'disable', function (err) {
            if (err) {
                res.status(500).send(false)
                return console.log(err);
            }
            console.log("Disabling the update service forever");
        });
    }
    else {
        console.log("Error: disable request not set to true: " + req.body.disable)
        res.status(401).send(false);
    }
});

app.listen(port, () => console.log(`Back-end listening on ${port}!`))