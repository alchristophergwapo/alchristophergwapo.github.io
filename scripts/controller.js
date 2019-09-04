// basic functionalities

// function for connect button
$('#btn-connect').click(function(){
	var broker = $("#input-broker-ws").val();
	client = mqtt.connect(broker);

	$("#status").text("Connecting");
	$("#status").removeClass("alert-secondary");
	$("#status").addClass("alert-warning");

	// connect callback function
	client.on("connect", function(){
		$("#status").text("Successfully connected");
		$("#status").removeClass("alert-warning");
		$("#status").addClass("alert-secondary");
		Swal.fire({
			position: 'top-end',
			type: 'success',
			title: 'Your successfully connect to the broker!',
			showConfirmButton: false,
			timer: 1500
		  })
		console.log("success");
	});
	client.on("message", function (topic, payload) {
		console.log([topic, payload].join(": "));
		var row = $("<tr>");
		$("<td>").text(topic).appendTo($(row));
		$("<td>").text(payload).appendTo($(row));
		$("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')).appendTo($(row));
		$("#tbl-body").append($(row));

  })

	// function for disconnect button
	$(".btn-disconnect").click(function() {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, disconnect!'
		  }).then((result) => {
			if (result.value) {
				client.end();
			  Swal.fire(
				'Disconnected!',
				'Your are disconnected to the broker.',
				'success'
			  );
			  $("#status").text("Disconnected");
				$("#status").removeClass("alert-warning");
				$("#status").addClass("alert-secondary");
			}
		  })
		
	});

	// function for publish button
	$("#btn-pub").click(function() {
		var topic = $("#topic").val();
		var payload = $("#message").val();
		if (topic == "" && payload == "") {
			Swal.fire({
			  type: 'error',
			  title: 'Oops...',
			  text: 'Please provide inputs!',
			});
		}
		else { 
			client.publish(topic,payload, function(err) {
				  if (err){
					Swal.fire({
						type: 'error',
						title: 'Oops...',
						text: 'An error occurs!',
					  });
				} else {
					console.log("published")
					Swal.fire('Published successfully!')
					var row = $("<tr>");
					$("<td>").text(topic).appendTo($(row));
					$("<td>").text(payload).appendTo($(row));
					$("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')).appendTo($(row));
					$("#tbl-body-pub").append($(row));
				}
			});
		}
	});

	// function for subscribe button
	$("#btn-sub").click(function() {
		var topic = $("#topic-sub").val();
		
		client.subscribe(topic, function(err) {
			if(err) {
				Swal.fire({
					type: 'error',
					title: 'Oops...',
					text: 'An error occurs!',
					});
			} else {
				var row = $("<tr>").attr("id", "mysub");
				$("<td>").text(topic).appendTo($(row));
				$("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')).appendTo($(row));
				$("#tbl-body-sub").append($(row));
				Swal.fire('Subscribed successfully!');
			}
		});
	})

	// function for unsubscribe button
	$("#btn-unsub").click(function() {
			var topic = $("#topic").val();
			client.unsubscribe(topic, function(err) {
				if(err) {
					Swal.fire({
						type: 'error',
						title: 'Oops...',
						text: 'An error occurs!',
					  });
				} else {
					Swal.fire("Unsubscribed successfully");
				}
			});
	})
	
});
