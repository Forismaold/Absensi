import React from 'react'
import { createRoot } from 'react-dom/client';
import './styles/index.css'
import { Provider } from 'react-redux';
import App from './component/App'
import reportWebVitals from './reportWebVitals'
import MyErrorBoundary from './component/Error/MyErrorBoundary'
import store from './redux/store'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const root = createRoot(document.getElementById('root'))
root.render(
    <MyErrorBoundary>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path='*' element={<App />}/>
                </Routes>
            </BrowserRouter>
        </Provider>
    </MyErrorBoundary>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
