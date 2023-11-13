
const prepareMachines = (machines: Array<any>, memory: any) => {
    machines.forEach((machine: any) => {
        memory[machine.id] = machine
    })
    return memory
}

const removeMachine = (machineId: string, memory: any) => {
    delete memory[machineId]
    return memory
}

export {
    prepareMachines,
    removeMachine
}
