import sys
import subprocess
import os

if len(sys.argv) < 3:
    print("Usage: worker.py <input.txt> <output.wav>")
    sys.exit(1)

input_file = sys.argv[1]
output_file = sys.argv[2]

# خواندن متن از فایل
with open(input_file, 'r', encoding='utf-8') as f:
    text = f.read()

# مسیر مدل Piper
model_path = os.path.join(os.path.dirname(__file__), '../models/en_US-ljspeech-high.onnx')

# اجرای Piper
cmd = ['python', '-m', 'piper', '--model', model_path, '--output_file', output_file]
result = subprocess.run(cmd, input=text.encode('utf-8'), capture_output=True)

if result.returncode != 0:
    print(f"Error: {result.stderr.decode()}")
    sys.exit(1)

print(f"✅ Audio saved to {output_file}")