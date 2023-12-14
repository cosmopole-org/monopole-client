
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { useEffect } from 'react';
import { SigmaRouter, themeColor } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { api } from '../../..';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useHookstate } from '@hookstate/core';
import { Button, IconButton } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import SigmaFab from '../../custom/elements/SigmaFab';
import ITower from '../../../api/models/tower';

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 112,
    editable: true,
  },
  {
    field: 'towers',
    headerName: 'Towers',
    width: 125,
    editable: false,
    renderCell: (params) => {
      const currentRow = params.row;
      let towerIds = Object.values(api.memory.spaces.get({ noproxy: true })).filter(t => t.folderId === currentRow.id).map(t => t.id)
      const onClick = (e: any) => {
        SigmaRouter.navigate('towerPicker', {
          initialData: {
            onTowerSelect: (tower: ITower) => {
              api.services.home.moveTowerToFolder({ towerId: tower.id, homeFolderId: currentRow.id })
            },
            onTowerDeselect: (tower: ITower) => {
              api.services.home.removeTowerFromFolder({ towerId: tower.id })
            },
            keepOnSelect: true,
            selectedTowerIds: towerIds
          }
        })
      };
      return (
        <Button onClick={onClick} variant='contained' style={{ borderRadius: 24 }} disableElevation>
          {towerIds.length}
          <Edit style={{ marginLeft: 8 }} />
        </Button>
      )
    }
  },
  {
    field: 'delete',
    headerName: 'Action',
    width: 112,
    editable: false,
    sortable: false,
    renderCell: (params) => {
      const onClick = (e: any) => {
        const currentRow = params.row;
        if (window.confirm('do you want to delete ' + currentRow.title)) {
          api.services.home.remove({ homeFolderId: currentRow.id })
        }
      };
      return (
        <IconButton onClick={onClick}><Delete /></IconButton>
      )
    }
  }
];

const ManageHomeFolders = (props: { id: string, isOnTop: boolean }) => {
  useEffect(() => {
    if (props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, () => SigmaRouter.back())
      switchRightControl && switchRightControl(RightControlTypes.NONE)
      switchTitle && switchTitle('Mofify Home Folders')
      switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
    }
  }, [])
  const folders = useHookstate(api.memory.homeFolders)
  const rows = folders.get({ noproxy: true }).map((folder: any) => ({ id: folder.id, title: folder.title, towerIds: folder.towerIds }))
  const processRowUpdate = (newRow: any) => {
    return newRow;
  };
  return (
    <SliderPage id={props.id}>
      <div style={{
        position: 'relative', width: 'calc(100% - 32px)', height: 'calc(100% - 32px)', zIndex: 2, transition: 'opacity .25s', backgroundColor: themeColor.get({ noproxy: true })[50], padding: 16
      }}>
        <DataGrid
          editMode="row"
          processRowUpdate={processRowUpdate}
          style={{
            backgroundColor: themeColor.get({ noproxy: true })['plain'],
            height: 'auto',
            borderRadius: 16,
            marginTop: 56,
            minHeight: 112
          }}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
          disableRowSelectionOnClick
        />
      </div>
      <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16 }}
        onClick={() => {
          let folderName = window.prompt('enter name of folder:', 'untitled')
          if (folderName) {
            if (folderName.length > 0) {
              api.services.home.create({ title: folderName })
            } else {
              alert('folder name can not be empty.')
            }
          } else {
            alert('folder name can not be empty.')
          }
        }}>
        <Add />
      </SigmaFab>
    </SliderPage>
  )
}

export default ManageHomeFolders

