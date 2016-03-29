var express = require('express');
var router = express.Router();
var ce = require('./commandExecutor');
var config = require('./config');
var exec = require('child_process').exec;

/* GET home page. */
router.get('/', function (req, res, next) {
    var status = "";
    //var commands = [
    //    "date",
    //    "configure_edison --showWiFiIP",
    //    "configure_edison --showWiFiMode",
    //    "configure_edison --showNames",
    //    "hostnamectl",
    //    "df -h",
    //    "free -h"
    //].join('; echo "\n\n" && ');

    res.render('index', {
        title: 'UNICEF monitoring station',
        moduleId: GLOBAL_CONFIG.moduleId,
        serverTime: new Date().getTime()
    });
});

/* GET closeSession. */
router.get('/closeSession', function (req, res, next) {
    ce.scriptExecutor(config.scripts.closeSession, function (error, stdout, stderr) {
        if (!error) {
            res.send('closeSession: ' + stdout);
        } else {
            res.send('error ' + error);
        }
    });

});

/* GET downloadPackages. */
router.get('/downloadPackages', function (req, res, next) {
    res.render('download', {
        title: 'UNICEF monitoring station - Download',
        packages: ["file1.zip", "file2.zip", "file3.zip"]
    });
});

/* GET syncTime. */
router.get('/syncTime', function (req, res, next) {
    ce.shellExecutor(config.shellCommands.syncTime + req.query.newTime, function (error, stdout, stderr) {
        if (!error) {
            res.send('Time set. ' + stdout);
        } else {
            res.status(500).send('error ' + error + '\n' + stderr);
        }
    });
});

var checkMotionSensorStatus = function () {
    return "OK";
}
var checkTouchSensorStatus = function () {
    return "OK";
}

/* GET hardwareStatus. */
router.get('/hardwareStatus', function (req, res, next) {
    ce.scriptExecutor(config.scripts.hardwareStatus, function (error, stdout, stderr) {
        if (!error) {
            var status = stdout.split(/-----/);
            if (status.length === 3) {
                res.render('hardwareStatus', {
                    title: 'UNICEF monitoring station - hardwareStatus',
                    camera: status[0],
                    voltage: status[1],
                    storage: status[2],
                    motion: checkMotionSensorStatus(),
                    touch: checkTouchSensorStatus()
                });
            } else {
                res.status(500).send('status parsing error:\n ' + stdout);
            }

        } else {
            res.status(500).send('error ' + error + '\n' + stderr);
        }
    });
});

module.exports = router;