export default class AudioManager {
  constructor() {
    Object.assign(this, {
      samples: {},
      ctx: new AudioContext(),
    });
  }

  async addSample(key, url) {
    const ret = await fetch(url);
    if (!ret.ok) {
      console.error(`unable to load sample for ${key}: ${url}`, ret.status);
      return;
    }
    this.samples[key] = await this.ctx.decodeAudioData(await ret.arrayBuffer());
  }

  play(key) {
    const source = this.ctx.createBufferSource();
    source.buffer = this.samples[key];
    source.connect(this.ctx.destination);
    source.start(0);
  }
}
