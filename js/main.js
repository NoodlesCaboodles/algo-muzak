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

function tone(type, pitch, time, length, volume) {
// tone('sine', 220, ctx.currentTime, 1, 0.5)
  const ty = type || 'sine'
  const pt = pitch || 440
  const t = time || ctx.currentTime
  const l = length || 1
  const vol = volume || 0.5


  const osc = new OscillatorNode(ctx, {type: ty})
  const lvl = new GainNode(ctx,{ gain: vol })

  osc.connect(lvl)
  lvl.connect(ctx.destination)
  lvl.connect(fft)

  osc.start(t)
  osc.stop(t + l)
  osc.frequency.setValueAtTime(pt, t)

}



const baseNotes = [440.0000, //A
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
               880]
const majorScale = [0,2,4,5,7,9,11,12]
const minorScale = [0,2,3,5,7,8,10,12]


const tempo = 140 // beats per 60 seconds. Seconds per beat is quarter note length
const theoreticalBeat = 60/tempo
const theoreticalBar = theoreticalBeat * 4

notes1 = [4,5,4,2,
          7, 9, 11, 12,
          12, 12, 4, 2]

notes2 = [3,5,3,2,
          7, 8, 10, 12,
          12, 12, 3, 2]



beats1 = [1/2, 1, 2, 4, 1/2, 1, 2, 4, 1/2, 1, 2, 4] //quarter note = 1, half note = 2, eight note = 1/2
eightBeats = [1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2, 1/2]
beats2 = [1/2, 1, 1/4, 1/4, 1/4, 1/4, 1/2, 1/2, 1, 1, 2, 2]

volumes1 = [.25, .25, .5, .75, .25, .25, .5, .75, .25, .25, .5, .75]
volumes2 = [.5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5, .5,]



allBeats = [1/4,1/2,1,2,4]
allVolumes = [1/4,1/2,3/4,1]




function step(rootFreq, steps) {
  let tr2 = Math.pow(2, 1 / 12)
  let rnd = rootFreq * Math.pow(tr2,steps)
  return Math.round(rnd * 100) / 100
}


function randomNoise() {
  for (let i = 0; i < 16; i++) {
    const time = ctx.currentTime + (i / 4)
    const noteInd = Math.floor(Math.random() * baseNotes.length)
    const pitch = baseNotes[noteInd]
    tone('sine', pitch, time, .25)
  }
}


function musicalNoise(scale, scaleRoot) {
  for (let i = 0; i < 16; i++) {
    const time = ctx.currentTime + (i / 4)
    const note = Math.floor(Math.random() * scale.length)
    const pitch = step(scaleRoot, note)
    tone('sine', pitch, time, 0.25)
  }
}

//notes is array of notes
//beats is length of each note

function functionalNotes(notes,beats,volumes,tempo,scaleRoot) {
  const beat = 60/tempo

    for (let i = 0; i < notes.length; i++) {
      const noteLen = beats[i] * beat
      const time = i * noteLen
      const amp = volumes[i]
      const pitch = step(scaleRoot, notes[i])
      console.log(time)
      tone('sine', pitch, time, noteLen, amp)
  }
}

function randomMusic(scale, scaleRoot) {
  for (let i = 0; i < 12; i++) {
    const time = ctx.currentTime + (i/4)

    const randomVolumes = Math.floor(Math.random() * allVolumes.length)
    const randomBeats = Math.floor(Math.random() * allBeats.length)

    const note = Math.floor(Math.random() * scale.length)
    const pitch = step(scaleRoot, note)

    tone('sine', pitch, time, randomBeats, randomVolumes)
  }
}


//Algorithmi Concert with 7 pieces
//piece 1
setTimeout(randomNoise, 5000)

//piece 2
function piece2 (){
  musicalNoise(majorScale,440)
}
setTimeout(piece2, 15000)

//piece 3
function piece3 (){
  randomNoise()
  musicalNoise(majorScale,440)
}
setTimeout(piece3, 25000)


//piece 4 initially an error but I found it interesting
function randomNoise2() {
  for (let i = 0; i < 16; i++) {
    const time = ctx.currentTime + (i / 4)
    const noteInd = Math.floor(Math.random() * baseNotes.length)
    const pitch = baseNotes[noteInd]
    tone('sine', pitch, time, .25)
    tone('sine', 440, time, .25)

  }
}

setTimeout(randomNoise2, 35000)


//piece 5
function piece5 (){
  functionalNotes(notes1,eightBeats,volumes1, 140, 440)
  functionalNotes(notes2,eightBeats,volumes1, 140, 440)
}

setTimeout(piece5, 45000)


//piece 6

function piece6 (){
  functionalNotes(notes1,beats1,volumes2, 140, 440)
  functionalNotes(notes2,beats2,volumes2, 140, 440)
}

setTimeout(piece6, 55000)



//piece 7 randomized song

function piece7 (){
  randomMusic(majorScale, 440)
  randomMusic(minorScale, 440)

}
setTimeout(piece7, 65000)
