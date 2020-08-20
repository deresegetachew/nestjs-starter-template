
/**
 * Entities which can be soft deleted should implement this interface.
 */
export interface SoftDeletable {
    deletedAt: Date | null;
}


/**
 * Entities which can be ordered relative to their siblings in a list.
 */
export interface Orderable {
    position: number;
}

