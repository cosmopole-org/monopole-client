
import type { FC } from 'react';
import useDrivePicker from "react-google-drive-picker";

export let openGooglePicker = () => { }

export default () => {
    const [openPicker] = useDrivePicker();
    openGooglePicker = () => {
        gapi.load('client:auth2', () => {
            gapi.client
                .init({
                    apiKey: 'AIzaSyCyqpXHhFv5dnMAvku77cAGAIVpr2gyHkE',
                })
                .then(() => {
                    let tokenInfo = gapi.auth.getToken();
                    const pickerConfig: any = {
                        clientId: '209261018094-g67cub474qcg8uh9c8fprjs5ub5mg09f.apps.googleusercontent.com',
                        developerKey: 'AIzaSyCyqpXHhFv5dnMAvku77cAGAIVpr2gyHkE',
                        viewId: 'DOCS',
                        viewMimeTypes: '*/*',
                        token: tokenInfo ? tokenInfo.access_token : null,
                        showUploadView: true,
                        showUploadFolders: true,
                        supportDrives: true,
                        multiselect: false,
                        callbackFunction: (data: any) => {
                            const elements = Array.from(
                                document.getElementsByClassName(
                                    'picker-dialog'
                                ) as HTMLCollectionOf<HTMLElement>
                            );
                            for (let i = 0; i < elements.length; i++) {
                                elements[i].style.zIndex = '99999';
                            }
                            if (data.action === 'picked') {
                                //Add your desired workflow when choosing a file from the Google Picker popup
                                //In this below code, I'm attempting to get the file's information. 
                                if (!tokenInfo) {
                                    tokenInfo = gapi.auth.getToken();
                                }
                                const fetchOptions = {
                                    headers: {
                                        Authorization: `Bearer ${tokenInfo.access_token}`,
                                    },
                                };
                                const driveFileUrl = 'https://www.googleapis.com/drive/v3/files';
                                data.docs.map(async (item: any) => {
                                    const response = await fetch(
                                        `${driveFileUrl}/${item.id}?alt=media`,
                                        fetchOptions
                                    );
                                });
                            }
                        },
                    };
                    openPicker(pickerConfig);
                });
        });
    };
    return null;
}
