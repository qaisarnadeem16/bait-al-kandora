export interface UndoRedoStep {
    type: string,
    id: number | null,
    direction: string
}