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
	
	// Edit user
	$('#userList table tbody').on('click', 'td a.linkedituser', editUser);
	
	// Delete a user
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	
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
			tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '">Edit</td>';
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

	} else {
		
		// if error count is more that zero, error out
		alert('Please fill in all fields');
		return false;
		
	}
	
}

function editUser(e){
	e.preventDefault();
	
	$('#btnAddUser').addClass('off');
	$('#btnSaveEdit, #btnCancelEdit').removeClass('off');
	
	// work in progress
	
	// Retrieve username from the link rel attribute
	var thisUserName = $(this).attr('rel');
	
	// Get Index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem){
			// Using ID to catch array index because I'm using the id as the rel tag
			return arrayItem._id;
	}).indexOf(thisUserName);
	
	
	// Get our object
	var thisUserObject = userListData[arrayPosition];
	
	// populate user fields
	$('#inputUserName').val(thisUserObject.username);
	$('#inputUserEmail').val(thisUserObject.email);
	$('#inputUserFullname').val(thisUserObject.fullname);
	$('#inputUserAge').val(thisUserObject.age);
	$('#inputUserLocation').val(thisUserObject.location);
	$('#inputUserGender').val(thisUserObject.gender);
	
	
	// on SAVE 
	$('#btnSaveEdit').on('click', function(e){
		e.preventDefault();
		
		
		// get user data and save it to an object
		var editedUser = {
			'username': $('#inputUserName').val(),
			'email': $('#inputUserEmail').val(),
			'fullname': $('#inputUserFullname').val(),
			'age': $('#inputUserAge').val(),
			'location': $('#inputUserLocation').val(),
			'gender': $('#inputUserGender').val()
		};
		
		$.ajax({
			type: 'PUT',
			data: editedUser,
			url: '/users/edituser/' + thisUserName,
			datatype: 'JSON'
		}).done(function(response){
			if(response.msg === ''){
				$('#addUser input').val('');
				$('#btnAddUser').removeClass('off');
				$('#btnSaveEdit, #btnCancelEdit').addClass('off');
				console.log(editedUser);
				populateTable();
			} else {
				alert('Error: ' + response.msg);
			}
		});
	});
	
	// CANCELS Edit
	$('#btnCancelEdit').on('click', function(e){
		e.preventDefault();
		
		$('#addUser input').val('');
		
		$('#btnAddUser').removeClass('off');
		$('#btnSaveEdit, #btnCancelEdit').addClass('off');
		
		return false;
	});
	
}

function deleteUser(event){
	event.preventDefault();
	
	// Pop up confirming that they want to be deleted
	var confirmation = confirm('Are you sure you want to delete this user?');
	
	// check confirmation
	if(confirmation === true){
		
		// if they do want to delete
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function(response){
			
			// check for a successful (blank) response
			if (response.msg === ''){
				
			} else {
				alert('Error: ' + response.msg);
			}
			
			// update table
			populateTable();
		});
		
	} else {
		// if they click cancel, cancel delete action
		return false;
	}
	
}