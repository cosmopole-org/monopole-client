
import { UploadFileRounded } from "@mui/icons-material"
import FileCard from "../custom/components/FileCard"
import FolderCard from "../custom/components/FolderCard"
import SigmaFab from "../custom/elements/SigmaFab"
import FilesAddressBar from "../custom/components/FilesAddressBar"

const Files = (props: { show: boolean }) => {
    return (
        <div
            style={{ display: props.show ? 'block' : 'none', width: '100%', height: 'calc(100% - 32px - 16px)', position: 'relative', paddingTop: 32 + 16 }}
        >
            <div
                style={{ width: 'calv(100% - 32px)', height: 'calc(100% - 64px)', paddingTop: 64, position: 'relative', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start' }}
            >
                {
                    [1, 2, 3, 4].map(index => (
                        <FolderCard key={`file-${index}`} style={{ marginTop: 16, marginLeft: 16, borderRadius: 8, width: 'calc(33% - 20px)' }} />
                    ))
                }
                {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(index => (
                        <FileCard key={`file-${index}`} style={{ marginTop: 16, marginLeft: 16, borderRadius: 8, width: 'calc(33% - 20px)' }} />
                    ))
                }
                <div style={{ width: '100%', height: 32 }} />
            </div>
            <FilesAddressBar style={{ position: 'absolute', left: 8, top: 48 + 16, width: 'calc(100% - 16px)' }} />
            <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16 }}>
                <UploadFileRounded />
            </SigmaFab>
        </div>
    )
}

export default Files
