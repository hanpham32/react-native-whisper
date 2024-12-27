import os
import tempfile
import flask
from flask import request
from flask_cors import CORS
from openai import OpenAI

app = flask.Flask(__name__)
CORS(app)

client = OpenAI()


# endpoint for handling the transcribing of audio inputs
@app.route("/transcribe", methods=["POST"])
def transcribe():
    if request.method == "POST":
        language = request.form.get("language", "en")
        model = request.form.get("model_size", "whisper-1")

        # create a temp directory to cache the uploaded file
        temp_dir = tempfile.mkdtemp()
        save_path = os.path.join(temp_dir, "temp.m4a")

        # get the uploaded file from the request
        m4a_file = request.files.get("audio_data")
        if not m4a_file:
            return "No audio file provided", 400

        m4a_file.save(save_path)
        print(f"save path:{save_path}")

        with open(save_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model=model,
                file=audio_file,
                language=language,  # optional if you want to explicitly set language
                # prompt="Optional prompt here"
            )

        # return transcription as text
        text = response.text
        return text
    else:
        return "This endpoint only processes POST wav blob", 405
