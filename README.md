# Audio — Multilingual Text-to-Speech System

A multilingual Text-to-Speech (TTS) system built around **Piper TTS** and ONNX voice models, with support for English and Persian speech synthesis.

The project is organized into separate frontend, backend, worker, and model components to keep the user interface, API layer, audio processing, and voice models isolated from each other.

---

## Features

* Text-to-Speech (TTS) generation
* English speech synthesis
* Persian speech synthesis
* Local ONNX voice models
* Piper TTS integration
* Separate frontend and backend architecture
* Dedicated worker for audio processing
* Extensible model directory for adding additional voices

---

## Project Architecture

The project is divided into four main components:

```text
Audio/
├── backend/
├── frontend/
├── models/
└── worker/
```

### Frontend

The `frontend` component provides the user interface.

Its responsibilities include:

* Accepting text input
* Selecting the required language/model
* Sending TTS requests to the backend
* Receiving generated audio
* Playing or providing the generated audio to the user

### Backend

The `backend` component provides the application/API layer.

Its responsibilities include:

* Receiving requests from the frontend
* Validating input
* Handling TTS requests
* Communicating with the worker
* Returning generated audio or the corresponding result

### Worker

The `worker` component is responsible for the actual audio generation process.

The general processing flow is:

```text
User Text
    │
    ▼
  Backend
    │
    ▼
  Worker
    │
    ▼
 Piper TTS
    │
    ▼
 ONNX Voice Model
    │
    ▼
 Generated Audio
```

Separating the worker from the backend allows audio generation to be handled independently from the API layer.

### Models

The `models` directory contains the Piper voice models used by the application.

Each Piper voice normally consists of an ONNX model and its corresponding JSON configuration:

```text
model.onnx
model.onnx.json
```

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/dariushmonajem/Audio.git
cd Audio
```

---

## 2. Prepare the Models Directory

Create the models directory if it does not already exist:

```bash
mkdir -p models
```

The final project structure should look similar to:

```text
Audio/
├── backend/
├── frontend/
├── worker/
└── models/
    ├── en_US-ljspeech-high.onnx
    ├── en_US-ljspeech-high.onnx.json
    ├── fa_IR-mana-medium.onnx
    └── fa_IR-mana-medium.onnx.json
```

---

# Download Piper Models

The application uses Piper ONNX voice models for speech synthesis.

## English — High Quality

The English voice model is:

```text
en_US-ljspeech-high
```

Download the following files:

* [en_US-ljspeech-high.onnx](https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ljspeech/high/en_US-ljspeech-high.onnx)
* [en_US-ljspeech-high.onnx.json](https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ljspeech/high/en_US-ljspeech-high.onnx.json)

Place both files inside:

```text
models/
```

The resulting structure should be:

```text
models/
├── en_US-ljspeech-high.onnx
└── en_US-ljspeech-high.onnx.json
```

Source:

[Rhasspy Piper Voices — English US LJSpeech High](https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/ljspeech/high)

---

## Persian

The Persian voice model is:

```text
fa_IR-mana-medium
```

The model is provided by:

[MahtaFetrat/Mana-Persian-Piper](https://huggingface.co/MahtaFetrat/Mana-Persian-Piper)

Download:

```text
fa_IR-mana-medium.onnx
fa_IR-mana-medium.onnx.json
```

Place the files inside:

```text
models/
```

The resulting structure should be:

```text
models/
├── fa_IR-mana-medium.onnx
└── fa_IR-mana-medium.onnx.json
```

---

# Python Environment

If the backend or worker requires Python dependencies, create a virtual environment:

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Windows

```powershell
python -m venv .venv
.venv\Scripts\activate
```

Install the project dependencies according to the dependency files provided in the repository.

For Piper TTS:

```bash
pip install piper-tts
```

---

# Model Requirements

Each voice model must have its corresponding configuration file.

For example:

```text
en_US-ljspeech-high.onnx
en_US-ljspeech-high.onnx.json
```

and:

```text
fa_IR-mana-medium.onnx
fa_IR-mana-medium.onnx.json
```

Do not rename the `.onnx` or `.onnx.json` files unless the application configuration is updated accordingly.

---

# Testing a Piper Model

A Piper voice can be tested independently before running the complete application.

Example:

```python
import wave
from piper import PiperVoice

voice = PiperVoice.load(
    "models/fa_IR-mana-medium.onnx"
)

with wave.open("test.wav", "wb") as wav_file:
    voice.synthesize_wav(
        "سلام به همگی!",
        wav_file
    )
```

If the model is loaded successfully, the generated audio will be written to:

```text
test.wav
```

---

# Audio Generation Flow

The complete application flow can be represented as:

```text
┌──────────────┐
│    User      │
└──────┬───────┘
       │
       │ Text
       ▼
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       │ API Request
       ▼
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │
       │ Processing Request
       ▼
┌──────────────┐
│    Worker    │
└──────┬───────┘
       │
       │ Piper TTS
       ▼
┌──────────────┐
│ ONNX Model   │
└──────┬───────┘
       │
       │ Generated Audio
       ▼
┌──────────────┐
│ Audio Output │
└──────────────┘
```

---

# Supported Voices

| Language     | Model                 | Format |
| ------------ | --------------------- | ------ |
| English (US) | `en_US-ljspeech-high` | ONNX   |
| Persian      | `fa_IR-mana-medium`   | ONNX   |

---

# Directory Structure

```text
Audio/
│
├── backend/
│   └── Backend/API implementation
│
├── frontend/
│   └── User interface
│
├── models/
│   ├── en_US-ljspeech-high.onnx
│   ├── en_US-ljspeech-high.onnx.json
│   ├── fa_IR-mana-medium.onnx
│   └── fa_IR-mana-medium.onnx.json
│
└── worker/
    └── Audio processing / TTS worker
```

---

# Adding a New Voice

Piper supports multiple voice models.

To add another voice:

1. Download the compatible Piper `.onnx` model.
2. Download its corresponding `.onnx.json` configuration file.
3. Place both files inside the `models/` directory.
4. Update the application configuration if the new model needs to be explicitly registered.
5. Test the model independently before using it through the application.

Example:

```text
models/
├── en_US-ljspeech-high.onnx
├── en_US-ljspeech-high.onnx.json
├── fa_IR-mana-medium.onnx
├── fa_IR-mana-medium.onnx.json
└── new_voice.onnx
    new_voice.onnx.json
```

---

# Troubleshooting

## Model Not Found

If the application cannot find a model, verify that:

* The model exists inside `models/`.
* The `.onnx` file name is correct.
* The corresponding `.onnx.json` file exists.
* The configured model path matches the actual file location.

Example:

```text
models/fa_IR-mana-medium.onnx
models/fa_IR-mana-medium.onnx.json
```

---

## Model Loading Error

If Piper cannot load a model, check:

* The ONNX file was downloaded completely.
* The JSON configuration belongs to the same model.
* The file was not renamed incorrectly.
* The installed Piper version is compatible with the model.

---

## No Audio Output

If the model loads successfully but no audio is produced, verify:

1. The input text is not empty.
2. The worker is running.
3. The selected model exists.
4. The output directory is writable.
5. The generated WAV/audio file is being returned correctly by the backend.

---

# Development

The project is designed so that the frontend, backend, worker, and voice models can be developed and maintained independently.

A typical development setup is:

```text
Frontend
   │
   ▼
Backend API
   │
   ▼
Worker
   │
   ▼
Piper
   │
   ▼
ONNX Voice Model
```

---

# License

The license of the application and the licenses of the individual voice models should be checked separately.

The project source code and third-party Piper voice models may have different licensing terms.

Before redistributing a model or generated voice assets, review the license associated with that specific model.

---

# References

* [Audio — GitHub Repository](https://github.com/dariushmonajem/Audio)
* [Piper Voices — Hugging Face](https://huggingface.co/rhasspy/piper-voices)
* [English LJSpeech High Model](https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/ljspeech/high)
* [Mana Persian Piper](https://huggingface.co/MahtaFetrat/Mana-Persian-Piper)

---

## Project Status

This project is under development.

The architecture is designed to support additional languages and Piper voice models in the future.
