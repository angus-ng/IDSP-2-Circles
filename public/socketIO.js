const socket = io();

socket.on('likeAlbum',function(data){
  console.log(data.user, data.albumId);
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
