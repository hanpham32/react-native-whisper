import os
import tempfile
import flask
from flask import request
from flask_cors import CORS
import whisper

app = flask.Flask(__name__)
CORS(app)


# endpoint for handling the transcribing of audio inputs
@app.route("/transcribe", methods=["POST"])
def transcribe():
    if request.method == "POST":
        language = request.form.get("language")
        model = request.form.get("model_size")

        if model != "large" and language == "english":
            model = model + ".en"

        audio_model = whisper.load_model(model)

        # create a temp directory to cache the uploaded file
        temp_dir = tempfile.mkdtemp()
        save_path = os.path.join(temp_dir, "temp.wav")

        # get the uploaded file from the request
        wav_file = request.files.get("audio_data")
        if not wav_file:
            return "No audio file provided", 400

        wav_file.save(save_path)

        # perform transcription
        if language == "english":
            result = audio_model.transcribe(save_path, language="english")
        else:
            result = audio_model.transcribe(save_path)

        # return transcription as text
        return result["text"]
    else:
        return "This endpoint only processes POST wav blob", 405
