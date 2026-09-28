const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'products.js');
let code = fs.readFileSync(filePath, 'utf8');

// Replace stories video links:
code = code.replace(
  /video:\s*\"https:\/\/assets\.mixkit\.co[^\"]+\"/g,
  'video: "/videos/walking.mp4"'
);

const sneakerVideos = ['/videos/walking.mp4', '/videos/finish_line.mp4', '/videos/skate.mp4'];
const scentVideos = ['/videos/flower.mp4', '/videos/oceans.mp4', '/videos/jellyfish.mp4'];
const watchVideos = ['/videos/finish_line.mp4', 'https://media.w3.org/2010/05/sintel/trailer.mp4', '/videos/walking.mp4'];
const apparelVideos = ['/videos/skate.mp4', '/videos/walking.mp4', '/videos/finish_line.mp4'];
const ugcVideos = [
  '/videos/walking.mp4',
  '/videos/finish_line.mp4',
  '/videos/skate.mp4',
  '/videos/flower.mp4',
  '/videos/oceans.mp4',
  '/videos/jellyfish.mp4',
  '/videos/w3c_sample.mp4'
];

let reelIdx = 0;
let ugcIdx = 0;

code = code.replace(/videoUrl:\s*\"https:\/\/assets\.mixkit\.co[^\"]+\"/g, (match, offset) => {
  const snippet = code.substring(Math.max(0, offset - 100), Math.min(code.length, offset + 300));
  if (snippet.includes('id: "ugc-') || snippet.includes("id: 'ugc-")) {
    const v = ugcVideos[ugcIdx % ugcVideos.length];
    ugcIdx++;
    return 'videoUrl: "' + v + '"';
  }
  if (snippet.includes('Versace') || snippet.includes('Tom Ford') || snippet.includes('Valentino') || snippet.includes('Azzaro') || snippet.includes('scents') || snippet.includes('Perfume') || snippet.includes('Fragrance')) {
    const v = scentVideos[reelIdx % scentVideos.length];
    reelIdx++;
    return 'videoUrl: "' + v + '"';
  }
  if (snippet.includes('Rado') || snippet.includes('Watch') || snippet.includes('Skeleton')) {
    const v = watchVideos[reelIdx % watchVideos.length];
    reelIdx++;
    return 'videoUrl: "' + v + '"';
  }
  if (snippet.includes('Prada') || snippet.includes('Tee') || snippet.includes('Hoodie') || snippet.includes('Jacket')) {
    const v = apparelVideos[reelIdx % apparelVideos.length];
    reelIdx++;
    return 'videoUrl: "' + v + '"';
  }
  const v = sneakerVideos[reelIdx % sneakerVideos.length];
  reelIdx++;
  return 'videoUrl: "' + v + '"';
});

fs.writeFileSync(filePath, code, 'utf8');
const remaining = (code.match(/assets\.mixkit\.co/g) || []).length;
console.log('Successfully updated! Remaining assets.mixkit.co:', remaining);
