import React from 'react'
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import path from 'path';

const app = express();

const serverRender = (req, res, next) => {
    // 이함수가 404가 떠야 하는 상황에 404를 띄우지 않고 서버 사이드 렌더링을 해 줍니다.
    const context = {};
    const jsx = (
        <StaticRouter location={req.url} context={context}>
            <App />
        </StaticRouter>
    );
    const root = ReactDOMServer.renderToString(jsx); // 랜더링 하고
    res.send(root); // 클라이언트에게 결과물을 응답함
}

// const html = ReactDOMServer.renderToString(
//     <div>Hello Server Side Rendering</div>
// );

// console.log(html);

const serve = express.static(path.resolve('./build'), {
    index: false
})

app.use(serve);
app.use(serverRender);

app.listen(5000, () => {
    console.log('Running on http://localhost:5000')
});