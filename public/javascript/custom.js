// Userlist data array for filling in the info box
var userListData = [];

// DOM READY =================================
$(document).ready(function(){
	
	//poulate the user table on the initial page load
	populateTable();
	
	// Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
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