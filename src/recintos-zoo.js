class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: { MACACO: 3 } },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: {} },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: { GAZELA: 1 } },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: {} },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: { LEAO: 1 } }
        ];

        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'] },
            LEOPARDO: { tamanho: 2, biomas: ['savana'] },
            CROCODILO: { tamanho: 3, biomas: ['rio'] },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'] },
            GAZELA: { tamanho: 2, biomas: ['savana'] },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'] }
        };
    }

    analisaRecintos(tipoAnimal, quantidade) {
        if (!this.animais[tipoAnimal]) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        const infoAnimal = this.animais[tipoAnimal];
        const tamanhoAnimal = infoAnimal.tamanho;
        const biomasAdequados = infoAnimal.biomas;

        const recintosViaveis = this.recintos
            .filter(recinto =>
                biomasAdequados.includes(recinto.bioma) &&
                this.isRecintoViavel(recinto, quantidade, tamanhoAnimal, tipoAnimal)
            )
            .map(recinto => {
                const espacoLivre = this.calcularEspacoLivre(recinto, quantidade, tamanhoAnimal);
                return {
                    numero: recinto.numero,
                    descricao: `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`,
                    espacoLivre
                };
            })
            .sort((a, b) => a.numero - b.numero)
            .map(item => item.descricao);

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        } else {
            return { erro: null, recintosViaveis: recintosViaveis };
        }
    }

    isRecintoViavel(recinto, quantidade, tamanhoAnimal, tipoAnimal) {
        const espacoNecessario = quantidade * tamanhoAnimal;
        const espacoOcupadoAtual = this.calcularEspacoOcupado(recinto);

        const temCarnivoro = Object.keys(recinto.animaisExistentes).some(animal => {
            return animal === 'LEAO' || animal === 'LEOPARDO' || animal === 'CROCODILO';
        });

        if (temCarnivoro && !recinto.animaisExistentes[tipoAnimal]) {
            return false;
        }

        if (tipoAnimal === 'MACACO' && Object.keys(recinto.animaisExistentes).length === 0 && espacoNecessario > recinto.tamanhoTotal) {
            return false;
        }

        return (recinto.tamanhoTotal - espacoOcupadoAtual) >= espacoNecessario;
    }

    calcularEspacoOcupado(recinto) {
        return Object.keys(recinto.animaisExistentes).reduce(
            (total, tipo) => total + (recinto.animaisExistentes[tipo] * this.animais[tipo].tamanho),
            0
        );
    }

    calcularEspacoLivre(recinto, quantidade, tamanhoAnimal) {
        const espacoNecessario = quantidade * tamanhoAnimal;
        const espacoOcupadoAtual = this.calcularEspacoOcupado(recinto);
        return recinto.tamanhoTotal - espacoOcupadoAtual - espacoNecessario;
    }
}

export { RecintosZoo as RecintosZoo };

// Exemplo de Chamada:
const zoo = new RecintosZoo();
const resultado = zoo.analisaRecintos('MACACO', 2);
console.log(resultado);
