
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// connection configurations
const mc = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'exeeto_online_test_db'
});

// connect to database
mc.connect();

 
 
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});


// Sign In 
app.post('/signIn',bodyParser.json(), function (req, res) {

			let email = req.body.email;
			let password = req.body.password;
			mc.query('SELECT * FROM tbl_signup where `tbl_signup_mobile`=? AND `tbl_signup_password`= ?', [email,password], function (error, results, fields) {
							numRows = results.length;
							console.log('okkkkkkkkkkkkk'+numRows);
							if(results.length ==0)
							{
										return res.send({ error: false, result: 'Failed' });
										
							}
							else
							{
										return res.send({ error: false, data: results, result: 'Success' });
										
							}
			});

});

/// subject list
app.get('/subjectList', function (req, res) {
	mc.query('SELECT `tbl_subject_id`, `tbl_subject_name`, `tbl_subject_active_status` FROM `tbl_subject` WHERE 1', function (error, results, fields) {
			if (error) throw error;
			return res.send({ error: false, bg_state: results, message: 'Todos list.' });
	});
});

// subsubject list
app.post('/subSubjectList',bodyParser.json(),  function (req, res) {

			let fk_tbl_subject_id = req.body.fk_tbl_subject_id;
			let sql = "SELECT `tbl_sub_subject_id`, `tbl_sub_subject_name`, `fk_tbl_subject_id`, `tbl_sub_subject_active_status` FROM `tbl_sub_subject` WHERE `tbl_sub_subject_active_status`=0 AND `fk_tbl_subject_id`=?";
			mc.query(sql, [fk_tbl_subject_id], function (error, results, fields) 
			{
						if(results.length ==0)
						{
								return res.send({ error: false, bg_state:results,result: 'Failed' });
										
						}
						else
						{

							return res.send({ error: false, bg_state: results, message: 'Todos list.' });
						}
		});
	});

	///get questionary list

	app.post('/getQuestionaryList',bodyParser.json(),  function (req, res) {

		let tbl_sub_subject_id = req.body.tbl_sub_subject_id;
		let sql1 = "SELECT `tbl_questionnaire_id`, `fk_tbl_sub_subject_id`, TQ.`fk_tbl_subject_id`, `tbl_questionnaire_time_limit`, `tbl_questionnaire_date`, 	`tbl_questionnaire_active_status`, `tbl_questionnaire_no_of_ques`,`tbl_sub_subject_name`,`tbl_subject_name`,`tbl_questionnaire_name`,`tbl_questionnaire_total_marks`	FROM `tbl_questionnaire` TQ,	`tbl_subject` TS,	`tbl_sub_subject` TSS	WHERE 	TQ.fk_tbl_sub_subject_id=TSS.tbl_sub_subject_id AND TSS.fk_tbl_subject_id=TS.tbl_subject_id AND	TQ.`tbl_questionnaire_active_status`=0 AND `fk_tbl_sub_subject_id`=?";
		mc.query(sql1, [tbl_sub_subject_id], function (error, results1, fields) {
			console.log("bbbbbbbbbbb"+JSON.stringify(results1));
		
					if(results1.length ==0)
					{
							return res.send({ error: false, QLIST:results1,result: 'Failed' });
									
					}
					else
					{

						return res.send({ error: false, QLIST: results1, message: 'Todos list.' });
					}
	});
});

//questionInQuestionnariesh

app.post('/questionInQuestionnaries',bodyParser.json(),  function (req, res) {

	let fk_tbl_questionnaire_id = req.body.fk_tbl_questionnaire_id;
	let sql1 = "SELECT `tbl_question_id`, `fk_tbl_questionnaire_id`, `tbl_question_name`, `tbl_question_option1`, `tbl_question_option2`, `tbl_question_option3`, 	`tbl_question_option4`, `tbl_question_answer`, `tbl_question_mark`	,`tbl_sub_subject_name`,`tbl_subject_name`,`tbl_questionnaire_name`,TSS.fk_tbl_subject_id,	tbl_questionnaire_no_of_ques	FROM `tbl_questionnaire` TQ,	`tbl_subject` TS,	`tbl_sub_subject` TSS,	`tbl_question_of_questionnaire` TQOQ	WHERE 	TQ.fk_tbl_sub_subject_id=TSS.tbl_sub_subject_id AND	TSS.fk_tbl_subject_id=TS.tbl_subject_id AND	TQ.`tbl_questionnaire_active_status`=0 AND TQ.tbl_questionnaire_id=TQOQ.fk_tbl_questionnaire_id AND `fk_tbl_questionnaire_id`=? ORDER BY `tbl_questionnaire_id` ASC";
		mc.query(sql1, [fk_tbl_questionnaire_id], function (error, results1, fields) {
			console.log("bbbbbbbbbbb"+JSON.stringify(results1));
		
					if(results1.length ==0)
					{
							return res.send({ error: false, bg_state:results1,result: 'Failed' });
									
					}
					else
					{

						return res.send({ error: false, bg_state: results1, message: 'Todos list.' });
					}
	});
});

// save test result

app.post('/saveTestResult',bodyParser.json(),  function (req, res) {

	let jsondata = req.body.jsondata;

	let sjsondata=JSON.parse(jsondata);

	let user_id= sjsondata[0]['user_id'];
	let questionnaries_id= sjsondata[0]['questionnaries_id'];
	let time_consumtion= sjsondata[0]['time_consumtion'];

	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	var query = "INSERT INTO tbl_questionnaire_result (" +
	" `fk_tbl_signup_id`, `fk_tbl_questionnaire_id`, `tbl_questionnaire_result_date`, `tbl_questionnaire_result_time`, `tbl_questionnaire_solve_time_consume`) " +
	"VALUES (?,?,?,?,?)";

	var data = [user_id, questionnaries_id,date,time,time_consumtion];


	mc.query(query,data, function (err, result) {
		if (err) throw err;

		var qId=result.insertId;

		console.log("ccccccccccccccccc"+JSON.stringify(sjsondata[0]['orderdata']));

		for(let i=0;i< sjsondata[0]['orderdata'].length;i++)
		{
			console.log("bbbbbbbbbbb"+sjsondata[0]['orderdata'][i]);

			let que_id=sjsondata[0]['orderdata'][i]['que_id'];
			 
			let ans=sjsondata[0]['orderdata'][i]['ans'];

			let ansstatus=0;

			var query = "SELECT  `tbl_question_answer` FROM `tbl_question_of_questionnaire` WHERE `tbl_question_id`=? AND `tbl_question_answer`=?";

			mc.query(query,[que_id,ans], function (err, result) {

				if(result.length==1)
				{
					ansstatus=1;
				}	
		
				var query = "INSERT INTO tbl_questionnaire_details_result (" +
				"  `fk_tbl_question_id`, `tbl_ques_det_res_answer`, `tbl_ques_det_res_status`, `fk_tbl_questionnarie_id`) " +
				"VALUES (?,?,?,?)";

				var data = [que_id,ans,ansstatus,qId]

				mc.query(query,data, function (err, result) {

					console.log("okkkkkkkkkkk");


				});

			});

		}

		return res.send({ error: false, Sucess: "One Record sucessfully insereted.", resultId: qId });

		
		
	});

});
// solve test result


app.post('/getSolvePaperList',bodyParser.json(),  function (req, res) {

	let tbl_signup_id = req.body.tbl_signup_id;
	let sql1 = "SELECT `tbl_questionnaire_id`, `fk_tbl_sub_subject_id`, TQ.`fk_tbl_subject_id`, `tbl_questionnaire_time_limit`, `tbl_questionnaire_date`,`tbl_questionnaire_active_status`, `tbl_questionnaire_no_of_ques`,`tbl_sub_subject_name`,`tbl_subject_name`,`tbl_questionnaire_name`,`tbl_signup_name`,`tbl_questionnaire_result_date`,`tbl_questionnaire_result_time`,`tbl_questionnaire_result_id`,`tbl_questionnaire_solve_time_consume`FROM `tbl_questionnaire` TQ,`tbl_subject` TS,`tbl_sub_subject` TSS,`tbl_questionnaire_result` TQR,`tbl_signup` TSR WHERE TQ.fk_tbl_sub_subject_id=TSS.tbl_sub_subject_id AND TSS.fk_tbl_subject_id=TS.tbl_subject_id AND TQ.`tbl_questionnaire_active_status`=0 AND TQ.`tbl_questionnaire_id`=TQR.fk_tbl_questionnaire_id AND TQR.fk_tbl_signup_id=TSR.tbl_signup_id AND TSR.tbl_signup_id=? ORDER BY `tbl_questionnaire_result_id` desc";
		mc.query(sql1, [tbl_signup_id], function (error, results1, fields) {
			console.log("bbbbbbbbbbb"+JSON.stringify(results1));
		
					if(results1.length ==0)
					{
							return res.send({ error: false, bg_state:results1,result: 'Failed' });
									
					}
					else
					{

						return res.send({ error: false, bg_state: results1, message: 'Todos list.' });
					}
	});
});

//solve paper details

app.post('/mySolveQuestionDetails',bodyParser.json(),  function (req, res) {

	let tbl_questionnaire_result_id = req.body.tbl_questionnaire_result_id;
	let sql1 = "SELECT `tbl_questionnaire_id`, `fk_tbl_sub_subject_id`, TQ.`fk_tbl_subject_id`, `tbl_questionnaire_time_limit`, `tbl_questionnaire_date`, `tbl_questionnaire_active_status`, `tbl_questionnaire_no_of_ques`,`tbl_sub_subject_name`,`tbl_subject_name`,`tbl_questionnaire_name`,`tbl_question_id`, `fk_tbl_questionnaire_id`, `tbl_question_name`,`tbl_question_option1`,`tbl_question_option2`, `tbl_question_option3`, `tbl_question_option4`,`tbl_question_answer`, `tbl_question_mark`,`tbl_ques_det_res_status`,`tbl_ques_det_res_answer` FROM `tbl_questionnaire` TQ,`tbl_subject` TS,`tbl_sub_subject` TSS,`tbl_question_of_questionnaire` TQOQ,`tbl_questionnaire_details_result` TQDR WHERE TQ.fk_tbl_sub_subject_id=TSS.tbl_sub_subject_id AND TSS.fk_tbl_subject_id=TS.tbl_subject_id AND TQ.`tbl_questionnaire_active_status`=0 AND TQ.`tbl_questionnaire_id`=TQOQ.fk_tbl_questionnaire_id AND TQDR.`fk_tbl_question_id`=TQOQ.tbl_question_id AND TQDR.fk_tbl_questionnarie_id=?";
		mc.query(sql1, [tbl_questionnaire_result_id], function (error, results1, fields) {
			console.log("bbbbbbbbbbb"+JSON.stringify(results1));
		
					if(results1.length ==0)
					{
							return res.send({ error: false, bg_state:results1,result: 'Failed' });
									
					}
					else
					{

						return res.send({ error: false, bg_state: results1, message: 'Todos list.' });
					}
	});
});

// register students bg

app.post('/signUp',bodyParser.json(),  function (req, res) {

	let signupdata = JSON.parse(req.body.data);

	//console.log("bbbbbbbbbbb"+JSON.stringify(data));

	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

	
	var query = "INSERT INTO tbl_signup (" +
	" `tbl_signup_name`, `tbl_signup_mobile`, `tbl_signup_email`, `tbl_signup_school`, `tbl_signup_location`, `tbl_signup_password`, `tbl_signup_reg_date`) " +
	"VALUES (?,?,?,?,?,?,?)";

	var data = [signupdata['tbl_signup_name'], signupdata['tbl_signup_mobile'],signupdata['tbl_signup_email'],signupdata['tbl_signup_school'],signupdata['tbl_signup_location'],signupdata['tbl_signup_password'],date]


	
	
		mc.query(query, data, function (error, results1, fields) {
			console.log("bbbbbbbbbbb"+JSON.stringify(results1));

			let sql1 = "SELECT `tbl_signup_id`, `tbl_signup_name`, `tbl_signup_mobile`, `tbl_signup_email`, `tbl_signup_school`, `tbl_signup_location`, `tbl_signup_password`,`tbl_signup_reg_date` FROM `tbl_signup` WHERE `tbl_signup_id`=?";
		mc.query(sql1, [results1.insertId], function (error, results, fields) 
		{
			console.log("bbbbbbbbbbb"+JSON.stringify(results));
			return res.send({ Sucess:"One Record sucessfully insereted.", data: results, message: 'Todos list.' });
			
		});



	});

});





 
// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});