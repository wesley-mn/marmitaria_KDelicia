class Cliente:
    def __init__(self, nome, telefone, endereco):
        self.nome = nome
        self.telefone = telefone
        self.endereco = endereco

    def __exibir_dados(self):
        print(f"Nome: {self.nome}")
        print(f"Telefone: {self.telefone}")