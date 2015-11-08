using WAV
using DSP

f, fs, nbits, opt = wavread("audio.wav")

f_down = fill(0.0, round(Int, floor(length(f)/32)))
for i = 1:32:length(f)
    f_down[round(Int, floor(i / 32))] = f[i]
end

rate = int(fs)
impulse_train = fill(0.0, rate * 3)
impulse_train[1] = 1.0
impulse_train[rate + 1] = 1.0
impulse_train[2 * rate + 1] = 1.0
sum(conv(f_down[1:rate*3], impulse_train))
