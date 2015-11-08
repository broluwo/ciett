using WAV
using DSP

f, fs, nbits, opt = wavread("audio.wav")
# FFTW.set_num_threads(np) ?
F = fft(f)

freqs = [0 200 400 800 1600 3200]
nfreqs = length(freqs)
maxfreq = 4096
bands = Array{Array{Complex{Float64}}}(nfreqs)
n = length(F)

for i = 1:(nfreqs - 1)
    bands[i] = getindex(F, [((floor(freqs[i]/maxfreq * n / 2) + 1)):(floor(freqs[i + 1]/maxfreq * n / 2))])
end
bands[nfreqs] = getindex(F, [(floor(freqs[nfreqs]/maxfreq * n / 2 + 1)):(floor(n/2))])
