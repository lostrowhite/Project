var express = require('express');
var router = express.Router();

/* GET book page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  db.query("select * from cao_usuario cu, permissao_sistema ps where ps.co_usuario = cu.co_usuario and ps.co_sistema = 1 and ps.in_ativo = 'S' and ps.co_tipo_usuario in (0,1,2)", function(err, results, fields){
    if (err) {
        res.send('error in database'+err);
    }else{
        res.send({ title: 'List of All Books',
                         consultores:results});
    }
  })
});

module.exports = router;