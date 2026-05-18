from flask import Flask, request, jsonify
from cliente import Cliente

app = Flask(__name__)

@app.route("/cadastrar", methods=["POST"])
def cadastrar():
    dados = request.json
    Cliente(
        nome=dados["nome"],
        telefone=dados["telefone"],
        sobrenome_tipo=dados.get("tipo", "marmita")
    ).salvar()
    return jsonify({"status": "ok"})

app.run(port=5000)