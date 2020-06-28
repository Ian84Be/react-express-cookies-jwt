
require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const restrictedMiddleware = require('./server/restricted-middleware');

const refreshExpires = process.env.REFRESH_TOKEN_EXPIRES || 1; // one minute
const jwtExpires = process.env.JWT_EXPIRES || 1; // one minute
const jwtSecret = process.env.JWT_SECRET || 'yaya';

const server = express();
server.use(helmet());
server.use(cookieParser());
server.use(express.json());

server.get('/cookie', (req, res) => {
	const options = {
		maxAge: refreshExpires * 60 * 1000,
		secure: process.env.API_ENV === 'production',
		httpOnly: true,
		domain: 'localhost'
	}

	const refreshToken = uuidv4();

	return res.cookie('refresh_token', refreshToken, options).status(200).send('cookie sent')
})

server.get('/refresh_token', (req, res) => {
	const refresh = req.cookies.refresh_token;
	
	if (refresh) {
		const fakeUser = {
			id: 3,
			branch: 16,
			role: 1
		}
		const newJWT = generateToken(fakeUser);
	
		res.status(200).json({
			token: newJWT,
			countdown: jwtExpires * 60 * 1000,
			token_expires: new Date(new Date().getTime() + (jwtExpires * 60 * 1000))
		})
	} else {
		res.status(401).json({message:'no refresh_token'})
	}

});

server.get('/restricted', restrictedMiddleware, (req, res) => {
	console.log(req.decodedJwt);
	const restrictedData = uuidv4();
	res.status(200).json({content: restrictedData});
})

server.listen(8080);

function generateToken(user) {
  const payload = {
    sub: user.id,
    branch: user.branch,
    role: user.role,
  };

  const options = {
    expiresIn: jwtExpires * 60 * 1000
	};
	
	const secret = jwtSecret || 'yaya'

  return jwt.sign(payload, secret, options);
}