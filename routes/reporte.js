var express = require('express');
var router = express.Router();

/* GET book page. */
router.post('/', function(req, res, next) {
  var db = req.db;
  db.query("SET lc_time_names = 'es_ES'", function (err, rows) {
    if (err){
    	res.send('error cambiando idioma'+err);
    }else{
    	db.query("Select cu.co_usuario, cu.no_usuario, MONTH(cf.data_emissao) mes, CONCAT( CONCAT(UCASE(LEFT(MONTHNAME(cf.data_emissao), 1)), SUBSTRING(MONTHNAME(cf.data_emissao), 2)),  ' de ', DATE_FORMAT(cf.data_emissao, '%Y')) as periodo, SUM(ROUND((cf.valor - cf.valor * cf.total_imp_inc /100),2)) Receita_liquida, csal.brut_salario Custo_Fixo, SUM(ROUND((cf.valor - cf.valor * cf.total_imp_inc /100)*(cf.comissao_cn /100),2)) comision, SUM(ROUND((cf.valor - cf.valor * cf.total_imp_inc /100)-((cf.valor - cf.valor * cf.total_imp_inc /100)*(cf.comissao_cn /100) + csal.brut_salario),2)) Lucro from cao_fatura cf, cao_sistema cs, cao_cliente cc, cao_os co, cao_usuario cu, cao_salario csal  where cf.co_cliente = cc.co_cliente and cf.co_sistema = cs.co_sistema and cf.co_os = co.co_os and csal.co_usuario = co.co_usuario and cu.co_usuario = co.co_usuario and co.co_usuario in ("+req.param('users')+") and cf.data_emissao BETWEEN '"+req.param('from')+"' and '"+req.param('to')+"' GROUP BY Periodo, cu.no_usuario ORDER BY cu.no_usuario", 
    		function(err, results, fields){
    	  if (err) {
    	      res.send('error en el query'+ err);
    	  }else{
    	      res.send({ title: 'Relatorio',
    	                       result:results});
    	  }
    	})
    }
  });
});

module.exports = router;