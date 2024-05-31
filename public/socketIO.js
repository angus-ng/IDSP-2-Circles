const socket = io();

const showNotification = (message) => {
  alert(message)
}

socket.on('likeAlbum',function(data){
    showNotification(`${data.user} has liked ${data.albumName}`)
})   

socket.on('newAlbum',function(data){
    showNotification(`${data.user} has created an album in ${data.circleName}`)
    console.log(data.user, data.circleName);
})

socket.on('updateAlbum',function(data){
  showNotification(`${data.user} has added ${data.photoCount} photos in ${data.albumName}`)
  console.log(data.user, data.albumId);
})   

socket.on('newComment',function(data){
  showNotification(`${data.user} has commented under ${data.albumName}`)
  console.log(data.parentUser, currentLocalUser,"new comment")
})   

socket.on('newCommentReply',function(data){
  showNotification(`${data.user} has replied to your comment in ${data.albumName}`)
  console.log(data.owner, data.albumName,"newcomment reply")
})   

socket.on('likeComment',function(data){  
  showNotification(`${data.user} has liked to your comment in ${data.albumName}`)
  console.log(data.user, data.albumName);
})   

socket.on('circleInvite', function(data) {
  showNotification(`${data.user} has invited you to the Circle: ${data.circleName}`)
  console.log(data.user, data.circleName)
})

socket.on('acceptCircleInvite', function(data) {
  showNotification(`${data.user} has joined your Circle: ${data.circleName}`)
  console.log(data.user, data.circleName)
})

socket.on('updateCircle', function(data) {
  showNotification(`${data.user} has updated your Circle: ${data.circleName}`)
  console.log(data.user, data.circleName)
})

socket.on('acceptFriendRequest', function(data) {
  showNotification(`${data.requestee} has accepted your friend request`)
  console.log(data.requestee)
})

socket.on('sentFriendRequest', function(data) {
  showNotification(`${data.requester} has send you a friend request`)
  console.log(data.requester)
})