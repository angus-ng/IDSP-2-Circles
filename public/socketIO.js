const socket = io();

const showNotification = (message) => {
  alert(message)
}

socket.on('likeAlbum',function(data){
  if(data.members.includes(currentLocalUser)) {
    showNotification(`${data.user} has liked your album`)
    console.log(data.members);
  }
})   
socket.on('newAlbum',function(data){
  console.log(data.user, data.albumId);
})   
socket.on('updateAlbum',function(data){
  console.log(data.user, data.albumId);
})   
socket.on('newComment',function(data){
  console.log(data.user, data.albumId);
})   
socket.on('likeComment',function(data){
  console.log(data.user, data.commentId);
})   
