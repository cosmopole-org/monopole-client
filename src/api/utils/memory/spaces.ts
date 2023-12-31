import IRoom from "../../models/room";
import ITower from "../../models/tower";

const prepareSpaces = (towers: Array<any>, rooms: Array<any>, memory: any) => {
    let towersDict: { [id: string]: any } = {}
    towers.forEach((tower: any) => {
        towersDict[tower.id] = tower;
        !tower.rooms && (tower.rooms = {})
        memory[tower.id] = tower
    });
    rooms.forEach((room: any) => {
        if (towersDict[room.towerId]) {
            towersDict[room.towerId].rooms[room.id] = room
        }
    });
    return memory
}

const transformTower = (tower: ITower, spaces: any) => {
    let oldTower = spaces[tower.id]
    if (oldTower) {
        oldTower.title = tower.title
        oldTower.avatarId = tower.avatarId
        oldTower.isPublic = tower.isPublic
        oldTower.secret = tower.secret
    }
    return spaces
}

const prepareRoom = (room: IRoom, spaces: any) => {
    let tower = spaces[room.towerId]
    tower.rooms[room.id] = room
    return spaces
}

const transformRoom = (room: IRoom, spaces: any) => {
    let oldRoom = spaces[room.towerId].rooms[room.id]
    if (oldRoom) {
        oldRoom.title = room.title
        oldRoom.avatarId = room.avatarId
        oldRoom.isPublic = room.isPublic
        oldRoom.secret = room.secret
        oldRoom.towerId = room.towerId
    }
    return spaces
}

const removeRoom = (towerId: string, roomId: string, spaces: any) => {
    delete spaces[towerId].rooms[roomId]
    return spaces
}

const removeTower = (towerId: string, spaces: any) => {
    delete spaces[towerId]
    return spaces
}

export {
    prepareSpaces,
    transformTower,
    prepareRoom,
    transformRoom,
    removeRoom,
    removeTower
}
