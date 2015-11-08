using WAV

f, fs, nbits, opt = wavread("audio.wav")
periods = round(Int, floor(fs / 1024))
E = fill(0.0, periods)

i_0 = 1
for period = 1:periods
    e_instant = 0
    for k = i_0:(i_0 + 1023)
        e_instant += (f[k,:][1])^2 + (f[k,:][2])^2
    end
    
    e_local = 0
    for i = 1:periods
        e_local += (E[i])^2
    end
    e_local /= periods
    
    variance = 0
    for i = 1:periods
        variance += (E[i] - e_local)^2
    end
    variance = sqrt(variance/periods)
    c = (-0.0025714 * variance) + 1.5142857
    
    E = circshift(E, 1)
    E[1] = e_instant
    
    if e_instant > c * e_local
        println(period, ": ", e_instant, " > ", c * e_local)
    end
    i_0 += 1024
end
