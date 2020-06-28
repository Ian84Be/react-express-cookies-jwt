import React, {useEffect, useState} from 'react';
import './App.css';
import superagent from 'superagent';

function App() {
	const [myJWT, setMyJWT] = useState('');
	const [counter, setCounter] = useState(0);
	const [data, setData] = useState('');

	useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

	function getCookie() {
		superagent.get('/cookie')
			.withCredentials()
			.then(res => console.log(res))
			.catch(err => console.log(err));
	}

	function getData() {
		superagent.get('/restricted')
			.withCredentials()
			.set('token', myJWT)
			.then(res => {
				const data = res.body;
				console.log(data);
				setData(data.content);
			})
			.catch(err => {
				setData(err.message);
				console.log(err);
			});
	}

	function refreshToken() {
		console.log('refreshToken()');

		superagent.get('/refresh_token')
			.withCredentials()
			.then(res => {
				const data = res.body;
				console.log(data);
				setMyJWT(data.token);
				setCounter(data.countdown / 1000);
				setTimeout(refreshToken, data.countdown);
			})
			.catch(err => {
				console.log(err);
				setMyJWT(err.message);
			});
	}

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="App-link"
          onClick={() => getCookie()}
        >
          Get Cookie
        </button>
        <button
          className="App-link"
          onClick={() => getData()}
        >
          Get Restricted Data
        </button>
        {counter===0 && (
					<button
          className="App-link"
          onClick={() => refreshToken()}
        >
          Refresh_Token
        </button>
				)}
				<h1>Token Refresh: {counter}s</h1>
				<p>Restricted Data: {data}</p>
				<p>JWT: {myJWT}</p>
      </header>
    </div>
  );
}

export default App;
