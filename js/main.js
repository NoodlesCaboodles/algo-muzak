const ctx = new (window.AudioContext || window.webkitAudioContext)()
const fft = new AnalyserNode(ctx, { fftSize: 2048 })
createWaveCanvas({ element: 'section', analyser: fft })


function adsr (param, peak, val, time, a, d, s, r) {

  const initVal = param.value
  param.setValueAtTime(initVal, time)
  param.linearRampToValueAtTime(peak, time+a)
  param.linearRampToValueAtTime(val, time+a+d)
  param.linearRampToValueAtTime(val, time+a+d+s)
  param.linearRampToValueAtTime(initVal, time+a+d+s+r)
}

const notes = [440.0000, //A
               466.1638, //A#
               493.8833, //B
               523.2511, //C
               554.3653, //C#
               587.3295, //D
               622.2540, //D#
               659.2551, //E
               698.4565, //F
               739.9888, //F#
               783.9909, //G
               830.6094, //G#
                                  ]

const tone = new OscillatorNode(ctx)

const vol = new GainNode(ctx,{ gain: 0.5 })

tone.connect(vol)
vol.connect(ctx.destination)
vol.connect(fft)

for (let i = 0; i < 16; i++) {
  const time = ctx.currentTime + (i / 4)
  const noteInd = Math.floor(Math.random() + notes.length)
  const pitch = notes[noteInd]
  tone.frequency.setValueAtTime(pitch, time)
}

tone.start(ctx.currentTime)
tone.stop(ctx.currentTime + 4)

/*
  const tone = new OscillatorNode(ctx)
  tone.connect(fft)
  tone.connect(ctx.destination)
  tone.start(ctx.currentTime)
  tone.stop(ctx.currentTime + 1)
*/
