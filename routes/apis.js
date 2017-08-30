var express = require('express');
var router = express.Router();
const connection = require('../utils/database');

/* Group */
router.get('/group/:id', function (req, res) {
  const id = req.params.id;
  // connection.connect();
  connection.query(`SELECT * from Groups where id=${id}`, function (err, rows, fields) {
    if (err) throw err;
    res.json(rows[0]);
  });
});
router.get('/group', function (req, res) {
  const name = req.query.name || '';
  const address = req.query.address || '';
  connection.query(`SELECT * FROM Groups WHERE groupName LIKE '%${name}%'`, function (err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});
router.post('/group/create', function (req, res) {
  const groupName = req.body.groupName;
  // check if req.groupName exist
  connection.query(`SELECT * FROM Groups WHERE groupName='${groupName}'`, function (err, rows, fields) {
    if (err) throw err;
    if (rows) {
      // already exist
      res.status(403).send('groupName already exist');
    }
    else {
      // insert
      connection.query(`INSERT INTO Groups (groupName) VALUES ('${groupName}')`, function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
      });
    }
  });
});
router.put('/group/:id', function (req, res) {
  const id = req.params.id;
  const groupName = req.body.groupName;
  connection.query(`UPDATE Groups SET groupName='${groupName}' WHERE id=${id}`, function (err, rows, fields) {
    res.status(200).send('update success');
  });
});

/* File */
router.post('/file/create', function (req, res) {
  const name = req.body.name;
  const address = req.body.address;
  connection.query(`SELECT * FROM Files WHERE name='${name}')`, function (err, rows, fields) {
    if (err) throw err;
    if (rows) {
      res.status(402).send('file already exist.');
    }
    else {
      connection.query(`INSERT INTO Files (name, address) VALUES ('${name}', '${address}')`, function (err, rows, fields) {
        if (err) throw err;
        res.json(rows);
      });
    }
  });
});
router.get('/file', function (req, res) {
  const name = req.query.name || '';
  const address = req.query.address || '';
  connection.query(`SELECT * FROM Files WHERE name LIKE '%${name}%' AND address LIKE '%${address}%'`, function (err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});
router.get('/file/:id', function (req, res) {
  const id = req.params.id;
  connection.query(`SELECT * FROM Files WHERE id=${id}`, function (err, rows, fields) {
    if (err) throw err;
    res.json(rows[0]);
  });
});
router.put('/file/:id', function (req, res) {
  const id = req.params.id;
  const name = req.body.name;
  const address = req.body.address;
  connection.query(`UPDATE Files SET name='${name}', address='${address}' WHERE id=${id}`, function (err, rows, fields) {
    if (err) throw err;
    res.json(rows[0]);
  });
})

/* group files */
// post group files
router.post('/group/:id/group-files', async (req, res) => {
  const groupId = req.params.id;
  const files = JSON.parse(req.body.files);
  const result = await files.map(function (file) {
    connection.query(`SELECT * FROM GroupFiles WHERE groupId=${groupId} AND fileId=${file}`, function (err, rows, fields) {
      if (err) throw err;
      if (rows) {
      } else {
        connection.query(`INSERT INTO GroupFiles (groupId, fileId) VALUES ('${groupId}','${file}')`, function (err, rows, fields) {
          if (err) throw err;
        });
      }
    });
  });
  res.status(200).send('create success');
});

// get group files
router.get('/group/:id/files', function (req, res) {
  const groupId = req.params.id;
  connection.query(`SELECT * FROM GroupFiles WHERE groupId='${groupId}'`, function (err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});


module.exports = router;

// router.get('/hello', function (req, res) {
//   res.json({ message: "第一個API!" });
// });
// router.get('/hello/:name', function (req, res) {
//   var asd = req.params.name;
//   res.json({ message: "第一個API!" + asd });
// });