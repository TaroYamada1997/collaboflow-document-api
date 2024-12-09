import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// ベースのURL
const baseUrl = 'https://cloud.collaboflow.com/{xxxxx}/api/index.cfm/v1';

// APIキーを設定
const apiKey = '{xxxxxxxxx}';

// 経路ID
const processesId = {xxxxx}; // 例) 1

// アプリケーションコード
const appCd = {xxxxx}; // 例) 1

// ファイルの相対パス
const filePath = '{xxxxx}'; // 例) '休暇届.pdf'

// ヘッダーを生成
const headers = {
    'X-Collaboflow-Authorization': `Basic ${apiKey}`
};

/**
 * ファイルをアップロードする関数
 * @param {string} filePath - アップロードするファイルのパス
 * @returns {Promise} - アップロードされたファイルのIDを含むレスポンス
 */
async function uploadFile(filePath) {
    const fileUrl = `${baseUrl}/files`;
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    
    try {
        const response = await axios.post(fileUrl, formData, {
            headers: {
                ...headers,
                ...formData.getHeaders()
            }
        });
        
        if (response.status !== 201) {
            throw new Error('ファイルの登録に失敗しました。' + response.statusText);
        }
        
        return response.data;
    } catch (error) {
        console.error('ファイルの登録に失敗しました。', error);
        throw error;
    }
}

/**
 * ドキュメント申請を行う関数
 * @param {string} fileId - アップロードされたファイルのID
 * @returns {Promise} - 申請のレスポンス
 */
async function submitDocument(fileId) {
    const documentUrl = `${baseUrl}/documents`;
    const payload = {
        processes_id: processesId,
        app_cd: appCd,
        document: {
            fidAttachment: fileId
        }
    };

    try {
        const response = await axios.post(documentUrl, payload, { headers });
        
        if (response.status !== 201) {
            throw new Error('ファイルの登録に失敗しました。' + response.statusText);
        }
        
        return response.data;
    } catch (error) {
        console.error('申請に失敗しました。', error);
        throw error;
    }
}

/**
 * メイン処理
 */
async function main() {
    try {
        const fileData = await uploadFile(filePath);
        console.log('ファイルがアップロードされました。', fileData);
        
        const documentData = await submitDocument(fileData.id);
        console.log('申請が完了しました。', documentData);
    } catch (error) {
        console.error('処理中にエラーが発生しました。', error);
    }
}

// メイン処理を実行
main();