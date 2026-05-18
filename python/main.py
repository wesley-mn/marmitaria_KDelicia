# main.py
from marmitaria import Marmitaria
from api import app
import threading
import schedule
import time

loja = Marmitaria()

def enviar_cardapio_diario():
    loja.enviar_cardapio_para_tipo(["marmitex", "marmita"], hora=9, minuto=0)

# Agenda o envio todo dia às 09:00
schedule.every().day.at("09:00").do(enviar_cardapio_diario)

# Roda a API em segundo plano (para receber cadastros do site)
thread_api = threading.Thread(target=lambda: app.run(port=5000))
thread_api.daemon = True
thread_api.start()

print("✅ API rodando na porta 5000")
print("✅ Envio de cardápio agendado para 09:00")

# Loop principal — mantém o agendador ativo
while True:
    schedule.run_pending()
    time.sleep(30)