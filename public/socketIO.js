const socket = io();

socket.on('likeAlbum',function(data){
    displayPopup(`${data.user} has liked ${data.albumName}`)
})   

socket.on('newAlbum',function(data){
  displayPopup(`${data.user} has created an album in ${data.circleName}`)
    console.log(data.user, data.circleName);
})

socket.on('updateAlbum',function(data){
  if (data.photoCount == "1") {
    displayPopup(`${data.user} has added a photo in ${data.albumName}`)
    return
  }
  displayPopup(`${data.user} has added ${data.photoCount} photos in ${data.albumName}`)
  console.log(data.user, data.albumId);
})   

socket.on('newComment',function(data){
  displayPopup(`${data.user} has commented under ${data.albumName}`)
  console.log(data.parentUser, currentLocalUser,"new comment")
})   

socket.on('newCommentReply',function(data){
  displayPopup(`${data.user} has replied to your comment in ${data.albumName}`)
  console.log(data.owner, data.albumName,"newcomment reply")
})   

socket.on('likeComment',function(data){  
  displayPopup(`${data.user} has liked to your comment in ${data.albumName}`)
  console.log(data.user, data.albumName);
})   

socket.on('circleInvite', function(data) {
  displayPopup(`${data.user} has invited you to the Circle: ${data.circleName}`)
  console.log(data.user, data.circleName)
})

socket.on('acceptCircleInvite', function(data) {
  displayPopup(`${data.user} has joined your Circle: ${data.circleName}`)
  console.log(data.user, data.circleName)
})

socket.on('updateCircle', function(data) {
  displayPopup(`${data.user} has updated your Circle: ${data.circleName}`)
  console.log(data.user, data.circleName)
})

socket.on('acceptFriendRequest', function(data) {
  displayPopup(`${data.requestee} has accepted your friend request`)
  console.log(data.requestee)
})

socket.on('sentFriendRequest', function(data) {
  displayPopup(`${data.requester} has send you a friend request`)
  console.log(data.requester)
})