const { UserService } = require("../src/userService")

const dadosUsuarioPadrao = {
  nome: "Fulano de Tal",
  email: "fulano@teste.com",
  idade: 25,
}

describe("UserService - Suíte de Testes sem Smells", () => {
  let userService

  // O setup é executado antes de cada teste
  beforeEach(() => {
    userService = new UserService()
    userService._clearDB() // Limpa o "banco" para cada teste
  })

  test("deve criar e buscar um usuário corretamente", () => {
    // Act 1: Criar
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    )
    expect(usuarioCriado.id).toBeDefined()

    // Act 2: Buscar
    const usuarioBuscado = userService.getUserById(usuarioCriado.id)
    expect(usuarioBuscado.nome).toBe(dadosUsuarioPadrao.nome)
    expect(usuarioBuscado.status).toBe("ativo")
  })

  test("deve desativar usuários se eles não forem administradores", () => {
    const usuarioComum = userService.createUser("Comum", "comum@teste.com", 30)

    const usuarioAtualizado = userService.getUserById(usuarioComum.id)
    const resultado = userService.deactivateUser(usuarioComum.id)
    expect(resultado).toBe(true)
    expect(usuarioAtualizado.status).toBe("inativo")
  })

  test("deve gerar um relatório de usuários formatado", () => {
    userService.createUser("Alice", "alice@email.com", 28)
    userService.createUser("Bob", "bob@email.com", 32)

    const relatorio = userService.generateUserReport()

    expect(relatorio).toContain("Alice")
    expect(relatorio).toContain("Relatório de Usuários")
  })

  test("deve falhar ao criar usuário menor de idade", async () => {
    expect(() => {
      userService.createUser("Menor", "menor@email.com", 17)
    }).toThrow("O usuário deve ser maior de idade.")
  })

  test("deve retornar uma lista vazia quando não há usuários", () => {
    const relatorio = userService.generateUserReport()
    expect(relatorio).toContain("Relatório de Usuários")
    expect(relatorio).toContain("Nenhum usuário cadastrado.")
  })
})
