
const prepareHumans = (humans: Array<any>, memory: any) => {
    humans.forEach((human: any) => {
        memory[human.id] = human
    })
    return memory
}

export {
    prepareHumans
}
