// user.route.js
import express from 'express';
import { validate } from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';

const router = express.Router();

router.route('/login').post(userCtrl.userLogin); /** User 登入 */

router.route('/')
    .get(userCtrl.userGet) /** 取得 User 所有值組 */
    .post(validate(paramValidation.createUser, {}), userCtrl.userPost); /** 新增 User 值組 */

router.route('/:user_id')
    .put(userCtrl.userPut) /** 修改 User 值組 */
    .delete(userCtrl.userDelete); /** 刪除 User 值組 */

export default router;
