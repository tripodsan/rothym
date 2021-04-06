window.AudioContext = window.AudioContext || window.webkitAudioContext;

export default class AudioManager {
  constructor() {
    Object.assign(this, {
      samples: {},
      samplesByIdx: [],
      ctx: new AudioContext(),
    });
  }

  async addSample(key, url) {
    const ret = await fetch(url);
    if (!ret.ok) {
      // eslint-disable-next-line no-console
      console.error(`unable to load sample for ${key}: ${url}`, ret.status);
      return;
    }
    // safari doesn't like async here
    this.ctx.decodeAudioData(await ret.arrayBuffer(), (data, err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('error decoding audio buffer', err);
        return;
      }
      const sample = {
        name: key,
        idx: this.samplesByIdx.length,
        buffer: data,
      };
      this.samples[key] = sample;
      this.samplesByIdx.push(sample);
    });
  }

  play(key) {
    const sample = typeof key === 'number' ? this.samplesByIdx[key] : this.samples[key];
    if (sample) {
      const source = this.ctx.createBufferSource();
      source.buffer = sample.buffer;
      source.connect(this.ctx.destination);
      source.start(0);
    }
  }
}
