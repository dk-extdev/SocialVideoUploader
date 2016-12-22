	$(document).ready(function(){
	  if(location.href.indexOf('youtube.com/watch?v')!=-1){
		$('#content').append("<div id='right_sidebar' style='width: 200px;height: 100%;border: 1px solid red;position: fixed;top: 50px;right: 0px;margin: 0 0 10px;border: 0;background: #ffc9c9;box-shadow: 0 11px 11px rgba(3,3,3,1.1);-moz-box-sizing: border-box;box-sizing: border-box;'></div>");
		var title = $('#eow-title').attr('title');//video title
		var url = location.href;//video url
		var config = new AWS.Config({
		  accessKeyId: 'AKIAIXFTC4AFQQADHSKA', secretAccessKey: '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', region: 'us-west-2'
		});
		var sqs = new AWS.SQS();
		sqs.createQueue({QueueName: 'test'}, function (err, data) {
		  console.log(data);
		  if (data) {
			var url = data.QueueUrl; // use this queue URL to operate on the queue
		  }
		});
		var queue = new AWS.SQS({params: {QueueUrl: 'https://sqs.us-west-1.amazonaws.com/729420376135/queueTaigaProc-v2'}});
		queue.sendMessage({MessageBody: 'THE MESSAGE TO SEND'}, function (err, data) {
		  if (!err) console.log('Message sent.');
		});
	  }
	});
//{"cmd": "PROCESS_YOUTUBE_LINK", "params": {"url": "https://www.youtube.com/watch?v=RXkAq9p24FQ", "vidTitle": "Baby toy learning video learn colors with wooden toys for babies toddlers preschoolers learn english", "appData": {"random": "random"}, "sqsResponseQueue": "queueRespmacubuntu-devlb"}, "id": "367cd0b8-cf90-489e-abfe-ec59c8af4ded"}
//
