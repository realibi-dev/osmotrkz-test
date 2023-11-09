import { NCALayerClient } from "ncalayer-js-client";
import axios from "axios";

const getRandomAuthData = async () => {
    const response = await axios.post(
        'https://sigex.kz/api/auth', 
        JSON.stringify({}), 
        {
            headers: { 
                "Content-Type": "application/json",
                "Accept": "*/*",
             },
        },
    );
    const data = await response.data;
    return data;
}

const getUserDataFromEcp = async (nonce, signature) => {
    const response = await axios.post(
        'https://sigex.kz/api/auth', 
        JSON.stringify({
            nonce,
            signature,
            external: true,
        }), 
        {
            headers: { 
                "Content-Type": "application/json",
                "Accept": "*/*",
             },
        },
    );
    const data = await response.data;
    return data;
}

export async function connectAndSign() {
    const ncalayerClient = new NCALayerClient();
    ncalayerClient.getActiveTokens

    try {
        await ncalayerClient.connect();
    } catch (error) {
        alert(`Не удалось подключиться к NCALayer: ${error.toString()}`);
        return;
    }

    let activeTokens;
    try {
        activeTokens = await ncalayerClient.getActiveTokens();
    } catch (error) {
        alert(error.toString());
        return;
    }

    const storageType = activeTokens[0] || NCALayerClient.fileStorageType;

    const { nonce } = await getRandomAuthData();

    let base64EncodedSignature;
    try {
        base64EncodedSignature = await ncalayerClient.createCAdESFromBase64(storageType, nonce, "AUTHENTICATION", false);
    } catch (error) {
        alert(error.toString());
        return;
    }

    return { nonce, base64EncodedSignature };
}

export const getUserInfoFromSertificate = async () => {
    try {
        const { nonce, base64EncodedSignature } = await connectAndSign();
        const { subject } = await getUserDataFromEcp(nonce, base64EncodedSignature);
        const subjectSplit = subject.split(',');
        const nameSurname = subjectSplit.find(elem => elem.startsWith('CN=')).split('=').at(-1);
        const givenName = subjectSplit.find(elem => elem.startsWith('GIVENNAME='))?.split('=')?.at(-1);
        const iin = subjectSplit.find(elem => elem.startsWith('SERIALNUMBER=')).split('=').at(-1).substring(3);
        const email = subjectSplit.find(elem => elem.startsWith('E=')).split('=').at(-1);

        return { nameSurname, givenName, iin, email }
        return 
    } catch (e) {
        alert(e.toString());
        return;
    }
}