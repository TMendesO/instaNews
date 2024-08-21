# InstaNews

InstaNews é uma aplicação web que exibe notícias no estilo de feed do Instagram. Utiliza diversas APIs de notícias para coletar artigos e, em seguida, exibe essas notícias em um layout similar ao do Instagram. Além disso, utiliza a API do Pixabay para gerar imagens relacionadas às notícias, caso a notícia não tenha uma imagem associada.

## Funcionalidades

- Exibe notícias em um layout estilo Instagram.
- Integração com diversas APIs de notícias, como New York Times, NewsAPI, e GNews.
- Geração de imagens para notícias sem imagens utilizando a API do Pixabay.
- Embaralhamento das notícias para exibição.

## Tecnologias Utilizadas

- **Frontend:**
  - React.js
  - SCSS para estilização
- **Backend:**
  - Node.js
  - Express.js
  - Axios para requisições HTTP
- **APIs:**
  - [New York Times API](https://developer.nytimes.com/)
  - [NewsAPI](https://newsapi.org/)
  - [GNews API](https://gnews.io/docs/)
  - [Pixabay API](https://pixabay.com/api/docs/)

## Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn

### Passo a Passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/instanews.git
   cd instanews
   ```

2. **Instale as dependências do projeto:**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configuração das Chaves de API:**

   - Crie um arquivo `.env` na raiz do projeto e adicione suas chaves de API:
     ```bash
     REACT_APP_NYT_API_KEY=your-nyt-api-key
     REACT_APP_NEWSAPI_KEY=your-newsapi-key
     REACT_APP_GNEWS_API_KEY=your-gnews-api-key
     PIXABAY_API_KEY=your-pixabay-api-key
     ```

4. **Inicie o servidor do proxy para gerar imagens:**

   ```bash
   node openai-proxy/index.js
   ```

5. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm start
   # ou
   yarn start
   ```

6. **Abra o navegador e acesse:**
   ```bash
   http://localhost:3000
   ```

## Estrutura de Pastas

```plaintext
instaNews/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Feed.js
│   │   ├── Post.js
│   ├── services/
│   │   └── newsService.js
│   ├── styles/
│   │   ├── Feed.scss
│   │   ├── Post.scss
│   ├── App.js
│   ├── App.scss
│   └── index.js
├── openai-proxy/
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

## Como Funciona

- **Feed:** As notícias são buscadas das APIs configuradas, processadas e exibidas em um formato de feed.
- **Geração de Imagens:** Caso uma notícia não tenha imagem, a API do Pixabay é chamada para gerar uma imagem relevante com base no título da notícia.
- **Embaralhamento:** As notícias de diferentes fontes são combinadas e embaralhadas antes de serem exibidas para o usuário.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/feature-name`)
3. Commit suas mudanças (`git commit -m 'Adiciona feature'`)
4. Faça um push para a branch (`git push origin feature/feature-name`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

- **Autor:** Thiago Mendes
- **Email:** thiago.mendes90@yahoo.com.br
- **LinkedIn:** [Meu LinkedIn](https://www.linkedin.com/in/thiago-mendes-dev/)
