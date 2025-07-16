import React from 'react'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './component/App'
import reportWebVitals from './reportWebVitals'
import MyErrorBoundary from './component/Error/MyErrorBoundary'
import store from './redux/store'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.css'
import './styles/toastyCostum.css'
import 'react-tooltip/dist/react-tooltip.css'


const root = createRoot(document.getElementById('root'))
root.render(
    <MyErrorBoundary>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path='*' element={<App />}/>
                </Routes>
            </BrowserRouter>
            <ToastContainer
                position="top-center"
                autoClose={50000}
                // hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Provider>
    </MyErrorBoundary>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
