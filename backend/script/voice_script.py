import gtts
from playsound import playsound
from translate import Translator
import sys

if len(sys.argv) < 1:
    print("Usage: python translator.py <sentence>")
    sys.exit(1)

sentence = sys.argv[1]
lang_code = 'en'
print(lang_code)

translator = Translator(to_lang=lang_code)

try:
    translation = translator.translate(sentence)
    print('Translation Successful:', translation)

    t1 = gtts.gTTS(text=translation, lang=lang_code)
    t1.save('speak.mp3')

    # Use a relative path to play the 'speak.mp3' file
    playsound('speak.mp3')

    print('Audio Playback Successful')

except Exception as e:
    pass
    print(f'Error: {e}')
    
