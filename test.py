#pip install dependencies and run python test.py

from flask import Flask, request, render_template
import os, json
app = Flask(__name__, template_folder=os.getcwd())

@app.route('/')
def testform():
    return render_template('example.html')

@app.route('/', methods=['POST'])
def testsubmit():
    print("request.data should have json with nested form data", request.data)
    return json.loads(request.data)

if __name__ == '__main__':
    app.run(debug=True)
