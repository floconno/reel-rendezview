var apiKey = 'AIzaSyAC4WYE0La-Hat568Md0lP_-jmTAT92Hfo';
var videoId = 'VIDEO_ID';

fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        var video = data.items[0];
        console.log('Video Title:', video.snippet.title);
        console.log('Video Description:', video.snippet.description);
    })
    .catch(error => {
        console.error('Error fetching video data:', error);
    });
