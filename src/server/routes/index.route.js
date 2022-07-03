// index.route.js
import express from 'express';
import config from '../../config/config';
import article from './article.route';
import user from './user.route';

const router = express.Router()

/* GET localhost:[port]/api page. */
router.get('/', (req, res) => {
    res.send(`Welcome to API: localhost:${config.port}/api`)
})

router.use('/user', user);
router.use('/article', article);

export default router
