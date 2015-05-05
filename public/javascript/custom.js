// Userlist data array for filling in the info box
var userListData = [];

// DOM READY =================================
$(document).ready(function(){
	
	//poulate the user table on the initial page load
	populateTable();
	
	// Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	
	// Add user on button click
	$('#btnAddUser').on('click', addUser);
	
});

// functions =================================

function populateTable(){
	
	// Empty content string
	var tableContent = '';
	
	// jQuery AJAX call for JSON
	$.getJSON('users/userlist', function(data){
		
		// Stick our user data into a userlist variable in the global object
		userListData = data;
		
		// For each item in out JSON, add a table row and cells to the content string
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});
		
		// inject the whole content string intou our existing HTML table
		$('#userList table tbody').html(tableContent);
	});
	
	
}

// Show User Info
function showUserInfo(event){
	
	// prevent Link from firing
	event.preventDefault();
	
	// Retrieve username from the link rel attribute
	var thisUserName = $(this).attr('rel');
	
	// Get Index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem){
		
		return arrayItem.username;
		
	}).indexOf(thisUserName);
	
	// Get our object
	var thisUserObject = userListData[arrayPosition];
	
	// Populate Info Box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
	
}

function addUser(event){
	event.preventDefault();
	
	// Basic volidation - increase errorCount var if any fields are blank
	var errorCount = 0;
	$('#addUser input').each(function(index, val){
		if($(this).val() === '') { errorCount++; }
	});
	
	// check the counter to make sure it's at zero
	if(errorCount === 0){
		
		// compile all user info into one object
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullname').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val()
		};
		
		// Use ajax to post the object to adduser service
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response){
			
			// check for successful (blank) response
			if(response.msg === ''){
				
				// clear the form inputs
				$('#addUser fieldset input').val('');
				
				// update the table
				populateTable();
				
			} else {
				
				// if something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);
				
			}
			
			
		});
		
		// else of if(errorCount === 0)
	} else {
		
		// if error count is more that zero, error out
		alert('Please fill in all fields');
		return false;
		
	}
	
}