// article.module.js
import jwt from 'jsonwebtoken';
import mysql from 'mysql';
import config from '../../config/config';

const connectionPool = mysql.createPool({ // 建立一個連線池
    connectionLimit: 10, // 限制池子連線人數
    host: config.mysqlHost, // 主機名稱
    user: config.mysqlUserName, // 用戶名稱
    password: config.mysqlPass, // 資料庫密碼
    database: config.mysqlDatabase // 資料庫名稱
});

// create article
const createArticle = (insertValues) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            // 建立一個連線若錯誤回傳err
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('INSERT INTO Article SET ?', insertValues, (error, result) => {
                    // Article資料表寫入一筆資料
                    if (error) {
                        console.error('SQL error: ', error); // 寫入資料庫有問題時回傳錯誤
                        reject(error);
                    } else if (result.affectedRows === 1) {
                        resolve(`文章新增成功 article_id: ${result.insertId}`); // 寫入成功回傳寫入id
                    }
                });
                connection.release();
            }
        });
    });
};

/*  Article GET JWT取得個人文章  */
const selectPersonalArticle = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'my_secret_key', (err, decoded) => {
            if (err) {
                reject(err); // 驗證失敗回傳錯誤
            } else {
                // JWT 驗證成功 ->取得用戶 user_id
                const userId = decoded.payload.user_id;
                // JWT 驗證成功 -> 撈取該使用者的所有文章
                connectionPool.getConnection((connectionError, connection) => { // 資料庫連線
                    if (connectionError) {
                        reject(connectionError); // 若連線有問題回傳錯誤
                    } else {
                        connection.query( // Article 撈取 user_id 的所有值組
                            'SELECT * FROM Article WHERE user_id = ?', [userId]
                            , (error, result) => {
                                if (error) {
                                    reject(error); // 寫入資料庫有問題時回傳錯誤
                                } else {
                                    resolve(result); // 撈取成功回傳 JSON 資料
                                }
                            }
                        );
                        connection.release();
                    }
                });
            }
        });
    });
};

// show article
const selectArticle = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => { // 資料庫連線
            if (connectionError) {
                reject(connectionError); // 若連線有問題回傳錯誤
            } else {
                connection.query(`SELECT * FROM Article`, (error, result) => {
                    if (error) {
                        console.error('SQL error: ', error);
                        reject(error); // 寫入資料庫有問題時回傳錯誤
                    } else {
                        resolve(result); // 撈取成功回傳 JSON 資料
                    }
                });
                connection.release();
            }
        });
    });
};

// edit article
const modifyArticle = (insertValues, articleId) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            // 資料庫連線
            if (connectionError) {
                reject(connectionError); // 若連線有問題回傳錯誤
            } else { // Article資料表修改指定id一筆資料
                connection.query('UPDATE Article SET ? WHERE article_id = ?', [insertValues, articleId], (error, result) => {
                    if (error) {
                        console.error('SQL error: ', error);// 寫入資料庫有問題時回傳錯誤
                        reject(error);
                    } else if (result.affectedRows === 0) { // 寫入時發現無該筆資料
                        resolve('文章Id不存在！');
                    } else if (result.message.match('Changed: 1')) { // 寫入成功
                        resolve('資料修改成功');
                    } else {
                        resolve('資料無異動');
                    }
                });
                connection.release();
            }
        });
    });
};

// delete article
const deleteArticle = (articleId) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('DELETE FROM Article WHERE article_id = ?', articleId, (error, result) => {
                    if (error) {
                        console.error('SQL error: ', error);
                        reject(error);
                    } else if (result.affectedRows === 1) {
                        resolve('刪除成功');
                    } else {
                        resolve('刪除失敗');
                    }
                });
                connection.release();
            }
        });
    });
};

export default {
    createArticle,
    selectPersonalArticle,
    selectArticle,
    modifyArticle,
    deleteArticle
};


