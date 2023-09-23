import { IForm as ICreateForm } from "@/components/CreateForm.vue";
import { SERVER } from "@/configs";

interface IResponse<IData> {
    code: number;
    data?: IData;
    message?: string;
}

interface ICreateData {
    roomId: string;
    invitation: string;
}

export const createRoom = async (body: ICreateForm) => {
    console.log(body);
    
    return fetch(SERVER + '/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    })
        .then(response => response.json())
        .then((result: IResponse<ICreateData>) => {
            if (result.code === 201 && result.data) {
                return {
                    roomId: result.data.roomId,
                    invitation: result.data.invitation
                }
            } else {
                throw new Error(result.message);
            }
        })
        .catch((error: string) => {
            console.error('/create error', error);
            return null;
        });
}

interface IGetRoom {
    title: string;
    src: string;
}
export const getRoom = async (roomId: string, invitation: string) => {
    return fetch(`${SERVER}/rooms/${roomId}?invitation=${invitation}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then((result: IResponse<IGetRoom>) => {
            if (result.code === 200 && result.data) {
                return {
                    title: result.data.title,
                    src: result.data.src
                }
            } else {
                throw new Error(result.message);
            }
        })
        .catch(error => console.log('error', error));
}