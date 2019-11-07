'use strict';

const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');

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

    confjson.mv("/greengrass/config/" + confjson.name, function(err) {
        if (err){
            console.log("Unable to copy config file!");
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

    pem.mv('/greengrass/certs/' + pem.name, function(err) {
        if (err){
            console.log("Unable to copy PEM file!");
            return res.status(500).send(err);
        }
        res.send(true)
    });
});

app.options('/cert-priv-key', cors())
app.post('/cert-priv-key', cors(), (req, res) => {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
  
    let privkey = req.files.privkey;

    privkey.mv('/greengrass/certs/' + privkey.name, function(err) {
        if (err){
            console.log("Unable to copy CERT file!");
            return res.status(500).send(err);
        }
        res.send(true)
    });
});

app.options('/disable', cors())
app.post('/disable', cors(), (req, res) => {
    if (req.body.disable === true){
        require('child_process').exec('systemctl disable greengrass-credentials', function(err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.send(true)
        });
    }
    else {
        console.log("Error: disable request not set to true: " + req.body.disable)
        res.status(401).send(false);
    }
});

app.options('/updatecredentials', cors())
app.post('/updatecredentials', cors(), (req, res) => {
    if (req.body.updatecredentials === true){
        require('child_process').exec('reboot', function(err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.send(true)
        });
    }
    else {
        console.log("Error: update credentials request not set to true: " + req.body.disable)
        res.status(401).send(false);
    }
});

app.options('/model', cors())
app.get('/model', cors(), (req, res) => {
    fs.readFile('/setup_descripion', function read(err, data) {
        if (err) {
            return console.log(err);
        }
        res.send(data);
    });
});

app.listen(port, () => console.log(`Back-end listening on ${port}!`))
