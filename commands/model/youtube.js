const ytdl = require('ytdl-core');
const queue = require('./database').queue;

module.exports.play = function(url, broadcast, connection, message) {
    let array = queue.get(message.guild.id);
    const stream = ytdl(url, { filter : 'audioonly' });
    broadcast.playStream(stream);
    connection.playBroadcast(broadcast)
    broadcast.on("end", function() {
        if(array&&array.length!=0){
            while ( (url = array.shift()) !== undefined ) {
                const stream = ytdl(url, { filter : 'audioonly' });
                message.channel.send(`Now playing : ${url}`);
                let broadcast = message.client.createVoiceBroadcast();
                broadcast.playStream(stream);
                connection.playBroadcast(broadcast)
                
                broadcast.on("end", function(){
                    console.log("Finished playing")
                });
            }
        }
    })
}