'use strict';

const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const exec = require('child_process').exec;

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
        console.log("Restarting Greengrass Software");
        require('child_process').exec('systemctl restart greengrass-software', function(err) {
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

app.options('/progress', cors())
app.post('/progress', cors(), (req, res) => {
    // get the deploy progress from a file
    // Since some things are run in a bash script, makes it easier to share
    // by file rather than a variable
    fs.readFile("/progress.txt", function read(err, data){
        if (err) {
            return res.status(401).send(false);
        }
        res.send(data);
    });
});

app.options('/webdashboards', cors())
app.post('/webdashboards', cors(), (req, res) => {
    // get the URL of web dashboard candidates
    fs.readFile("/webdashboards.txt", "utf8", function read(err, data){
        if (err) {
            return res.status(401).send(false);
        }
        res.send(data);
    });
});

app.options('/bigbang', cors())
app.post('/bigbang', cors(), (req, res) => {
    console.log(req.body.keyId);
    console.log(req.body.key);
    console.log(req.body.ggName);

    //res.send(true);

    fs.readFile('/etc/hostname', function read(err, data) {
        if (err) {
            return console.log(err);
        }
        
        var cmd = '/aws-nxp-ai-at-the-edge/entrypoint.sh '
                    + 'pastademo' + (data + '').replace("\n", "") + ' '
                    + req.body.ggName + ' '
                    + req.body.keyId + ' ' + req.body.key

        console.log(cmd)
        
        // The command takes too long. Answer the server just to let it know
        // the request went well.
        res.send(true);

        var entry = exec(cmd,
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            } else
                console.log("Restarting Greengrass Software");
        });
    });
});

app.listen(port, () => console.log(`Back-end listening on ${port}!`))
