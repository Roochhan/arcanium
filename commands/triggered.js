const Jimp = require('jimp');
const GIFEnc = require('gifencoder');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.run = async function(bot, message, args) {

  try {
    const options = {
      frames: 8,
      size: 256
    };
    let user;
    if (!message.mentions.members.first()) {
      user = message.author;
    } else {
      user = message.mentions.members.first().user;
    }
    // const user = message.mentions.members.first().user || message.author;
    const avatarURL = user.displayAvatarURL;
    const base = new Jimp(options.size, options.size);
    const avatar = await Jimp.read(avatarURL);
    const text = await Jimp.read('https://cdn.glitch.com/56ae3fa0-1206-4811-bd49-70b91bab9197%2F045756cf-f2f6-435d-a469-dc56cbff0d8c.image.png?v=1581111126502');

    avatar.resize(320, 320);
    avatar.color([
      { apply: 'mix', params: ['#FF0000', '30'] }
    ]);
    text.scaleToFit(280, 60);

    const frames = [];
    const buffers = [];
    const encoder = new GIFEnc(256, 256);
    const stream = encoder.createReadStream();
    let temp;

    stream.on('data', buffer => buffers.push(buffer));
    stream.on('end', () => message.channel.send({ files: [{ attachment: Buffer.concat(buffers), name: 'triggered.gif' }] }));

    for (let i = 0; i < options.frames; i++) {
      temp = base.clone();

      if (i === 0) temp.composite(avatar, -16, -16);
      else temp.composite(avatar, -32 + getRandomInt(-16, 16), -32 + getRandomInt(-16, 16));

      if (i === 0) temp.composite(text, -10, 200);
      else temp.composite(text, -12 + getRandomInt(-8, 8), 200 + getRandomInt(-0, 12));

      frames.push(temp.bitmap.data);
    }
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(20);
    for (const frame of frames) encoder.addFrame(frame);
    encoder.finish();

  } catch (err) {
    return message.reply(`aconteceu um erro: \`${err.message}\`. Tente novamente!`);
  }

};


module.exports.help = {
  
  name: 'triggered'
}
