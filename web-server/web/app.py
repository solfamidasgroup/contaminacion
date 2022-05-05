from flask import Flask, render_template, send_from_directory
import folium

app=Flask(__name__)


@app.route('/')
def index():  
    return render_template("index.html")

@app.route("/marcador")
def send():
    return {"saludo": "hola"}
    

if __name__ == '__main__':
    app.run(debug=True, port=5000)